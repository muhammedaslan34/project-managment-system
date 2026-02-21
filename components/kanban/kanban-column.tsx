'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './kanban-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MoveHorizontal as MoreHorizontal } from 'lucide-react'
import { Column, Task } from '@/lib/types'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  taskCount: number
}

export function KanbanColumn({ column, tasks, taskCount }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex-1 min-w-0">
      <Card className={`h-full ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span>{column.name}</span>
              <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                {taskCount}
              </span>
              {column.wip_limit && taskCount > column.wip_limit && (
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                  WIP Limit: {column.wip_limit}
                </span>
              )}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            ref={setNodeRef}
            className="space-y-3 min-h-[200px] pb-3"
          >
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </SortableContext>
            
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
                Drop tasks here
              </div>
            )}
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add a task
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}