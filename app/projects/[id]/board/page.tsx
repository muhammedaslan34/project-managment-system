'use client'

import { useState } from 'react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings, Users, ListFilter as Filter } from 'lucide-react'
import { Column, Task, TaskLabel } from '@/lib/types'

// Mock data
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

const mockLabels: TaskLabel[] = [
  { id: '1', org_id: '1', name: 'Frontend', color: '#3b82f6' },
  { id: '2', org_id: '1', name: 'Backend', color: '#10b981' },
  { id: '3', org_id: '1', name: 'Bug', color: '#ef4444' },
  { id: '4', org_id: '1', name: 'Feature', color: '#8b5cf6' },
]

const mockColumns: Column[] = [
  { id: '1', board_id: '1', name: 'To Do', wip_limit: undefined, sort_order: 1 },
  { id: '2', board_id: '1', name: 'In Progress', wip_limit: 3, sort_order: 2 },
  { id: '3', board_id: '1', name: 'Review', wip_limit: 2, sort_order: 3 },
  { id: '4', board_id: '1', name: 'Done', wip_limit: undefined, sort_order: 4 },
]

const mockTasks: Task[] = [
  {
    id: '1',
    project_id: 'WEB',
    board_id: '1',
    column_id: '1',
    title: 'Design homepage mockups',
    description: 'Create high-fidelity mockups for the new homepage design including mobile responsive layouts',
    type: 'task',
    status: 'todo',
    priority: 'high',
    estimate_points: 5,
    due_date: new Date('2024-01-15'),
    created_by: '1',
    assignee_id: '1',
    sort_order: 1,
    archived: false,
    created_at: new Date(),
    assignee: mockUser,
    labels: [mockLabels[0], mockLabels[3]],
    comments: [{ id: '1', task_id: '1', author_id: '1', body: 'Started working on this', mentions: [], created_at: new Date() }],
    attachments: []
  },
  {
    id: '2',
    project_id: 'WEB',
    board_id: '1',
    column_id: '1',
    title: 'Set up development environment',
    description: 'Configure local development setup with all necessary tools and dependencies',
    type: 'task',
    status: 'todo',
    priority: 'medium',
    estimate_points: 3,
    due_date: new Date('2024-01-20'),
    created_by: '1',
    assignee_id: '2',
    sort_order: 2,
    archived: false,
    created_at: new Date(),
    assignee: { ...mockUser, id: '2', name: 'Jane Smith' },
    labels: [mockLabels[1]],
    comments: [],
    attachments: []
  },
  {
    id: '3',
    project_id: 'WEB',
    board_id: '1',
    column_id: '2',
    title: 'Implement user authentication',
    description: 'Add login/logout functionality with JWT tokens',
    type: 'story',
    status: 'in_progress',
    priority: 'urgent',
    estimate_points: 8,
    due_date: new Date('2024-01-18'),
    created_by: '1',
    assignee_id: '1',
    sort_order: 1,
    archived: false,
    created_at: new Date(),
    assignee: mockUser,
    labels: [mockLabels[1], mockLabels[3]],
    comments: [
      { id: '2', task_id: '3', author_id: '1', body: 'Working on JWT implementation', mentions: [], created_at: new Date() },
      { id: '3', task_id: '3', author_id: '2', body: 'Need help with token refresh logic', mentions: ['1'], created_at: new Date() }
    ],
    attachments: [{ id: '1', task_id: '3', project_id: 'WEB', uploader_id: '1', file_key: 'auth-flow.png', file_name: 'auth-flow.png', size: 1024, mime: 'image/png', created_at: new Date() }]
  },
  {
    id: '4',
    project_id: 'WEB',
    board_id: '1',
    column_id: '3',
    title: 'Fix responsive layout issues',
    description: 'Address mobile layout problems on the dashboard page',
    type: 'bug',
    status: 'review',
    priority: 'high',
    estimate_points: 2,
    due_date: new Date('2024-01-12'),
    created_by: '2',
    assignee_id: '2',
    sort_order: 1,
    archived: false,
    created_at: new Date(),
    assignee: { ...mockUser, id: '2', name: 'Jane Smith' },
    labels: [mockLabels[0], mockLabels[2]],
    comments: [],
    attachments: []
  },
  {
    id: '5',
    project_id: 'WEB',
    board_id: '1',
    column_id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    type: 'task',
    status: 'done',
    priority: 'medium',
    estimate_points: 5,
    due_date: new Date('2024-01-10'),
    created_by: '1',
    assignee_id: '1',
    sort_order: 1,
    archived: false,
    created_at: new Date(),
    assignee: mockUser,
    labels: [mockLabels[1]],
    comments: [{ id: '4', task_id: '5', author_id: '1', body: 'Pipeline is working great!', mentions: [], created_at: new Date() }],
    attachments: []
  }
]

export default function ProjectBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const handleTaskMove = (taskId: string, newColumnId: string, newPosition: number) => {
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks]
      const taskIndex = updatedTasks.findIndex(t => t.id === taskId)
      
      if (taskIndex === -1) return prevTasks

      const task = updatedTasks[taskIndex]
      const oldColumnId = task.column_id

      // Update the task's column
      updatedTasks[taskIndex] = {
        ...task,
        column_id: newColumnId,
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

    // Here you would typically make an API call to update the task on the server
    console.log(`Moved task ${taskId} to column ${newColumnId} at position ${newPosition}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={mockUser} organization={mockOrganization} />
      
      <div className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Website Redesign</h1>
              <p className="text-muted-foreground">WEB • Board View</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Members
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <main className="p-6">
        <KanbanBoard
          columns={mockColumns}
          tasks={tasks}
          onTaskMove={handleTaskMove}
        />
      </main>
    </div>
  )
}