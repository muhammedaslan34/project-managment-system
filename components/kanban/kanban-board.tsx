'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { Task, Column } from '@/lib/types'

interface KanbanBoardProps {
  columns: Column[]
  tasks: Task[]
  onTaskMove: (taskId: string, newColumnId: string, newPosition: number) => void
}

export function KanbanBoard({ columns, tasks, onTaskMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find the active task
    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Check if we're over a column or another task
    const overColumn = columns.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)

    if (overColumn) {
      // Moving to a different column
      if (activeTask.column_id !== overColumn.id) {
        const columnTasks = tasks.filter(t => t.column_id === overColumn.id)
        onTaskMove(activeTask.id, overColumn.id, columnTasks.length)
      }
    } else if (overTask && overTask.column_id !== activeTask.column_id) {
      // Moving to a different column via another task
      const overTaskIndex = tasks
        .filter(t => t.column_id === overTask.column_id)
        .findIndex(t => t.id === overTask.id)
      
      onTaskMove(activeTask.id, overTask.column_id, overTaskIndex)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)

    if (!activeTask) return

    // If dropping on another task in the same column, reorder
    if (overTask && overTask.column_id === activeTask.column_id) {
      const columnTasks = tasks
        .filter(t => t.column_id === activeTask.column_id)
        .sort((a, b) => a.sort_order - b.sort_order)
      
      const activeIndex = columnTasks.findIndex(t => t.id === activeId)
      const overIndex = columnTasks.findIndex(t => t.id === overId)

      if (activeIndex !== overIndex) {
        onTaskMove(activeTask.id, activeTask.column_id, overIndex)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = tasks
            .filter(task => task.column_id === column.id)
            .sort((a, b) => a.sort_order - b.sort_order)

          return (
            <SortableContext
              key={column.id}
              items={columnTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                tasks={columnTasks}
                taskCount={columnTasks.length}
              />
            </SortableContext>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <KanbanCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}