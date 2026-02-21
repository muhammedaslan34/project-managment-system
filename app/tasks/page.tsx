'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, ListFilter as Filter, Calendar, User, CircleAlert as AlertCircle } from 'lucide-react'
import { Task, Column } from '@/lib/types'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  org_id: '1',
  role: 'admin' as const,
  created_at: new Date()
}

const mockOrganization = {
  name: 'Acme Corp'
}

const taskColumns: Column[] = [
  { id: 'todo', board_id: 'tasks', name: 'To Do', sort_order: 1 },
  { id: 'in_progress', board_id: 'tasks', name: 'In Progress', wip_limit: 5, sort_order: 2 },
  { id: 'review', board_id: 'tasks', name: 'Review', sort_order: 3 },
  { id: 'done', board_id: 'tasks', name: 'Done', sort_order: 4 },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleTaskMove = (taskId: string, newColumnId: string, newPosition: number) => {
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks]
      const taskIndex = updatedTasks.findIndex(t => t.id === taskId)
      
      if (taskIndex === -1) return prevTasks

      const task = updatedTasks[taskIndex]
      const oldColumnId = task.column_id

      const statusMap: Record<string, Task['status']> = {
        'todo': 'todo',
        'in_progress': 'in_progress',
        'review': 'review',
        'done': 'done'
      }

      const newStatus = statusMap[newColumnId] || task.status

      // Update the task's column and status
      updatedTasks[taskIndex] = {
        ...task,
        column_id: newColumnId,
        status: newStatus,
        sort_order: newPosition
      }

      // Update sort orders for tasks in the old column
      if (oldColumnId !== newColumnId) {
        updatedTasks
          .filter(t => t.column_id === oldColumnId && t.id !== taskId)
          .forEach((t, index) => {
            const taskIdx = updatedTasks.findIndex(ut => ut.id === t.id)
            if (taskIdx !== -1) {
              updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], sort_order: index }
            }
          })
      }

      // Update sort orders for tasks in the new column
      const newColumnTasks = updatedTasks
        .filter(t => t.column_id === newColumnId)
        .sort((a, b) => a.sort_order - b.sort_order)

      newColumnTasks.forEach((t, index) => {
        const taskIdx = updatedTasks.findIndex(ut => ut.id === t.id)
        if (taskIdx !== -1) {
          updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], sort_order: index }
        }
      })

      return updatedTasks
    })

    console.log(`Moved task ${taskId} to ${newColumnId} at position ${newPosition}`)
  }

  const todoTasks = tasks.filter(task => task.status === 'todo')
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress')
  const reviewTasks = tasks.filter(task => task.status === 'review')
  const doneTasks = tasks.filter(task => task.status === 'done')
  const overdueTasks = tasks.filter(task =>
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={mockUser} organization={mockOrganization} />
      
      <div className="flex">
        <Sidebar className="hidden md:block border-r" />
        
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                <p className="text-muted-foreground">
                  Drag tasks between columns to update their status.
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search tasks..."
                  className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Due Date
              </Button>
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Assignee
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">To Do</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todoTasks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inProgressTasks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Review</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reviewTasks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Done</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doneTasks.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Board */}
            <div className="mt-8">
              <KanbanBoard
                columns={taskColumns}
                tasks={tasks}
                onTaskMove={handleTaskMove}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}