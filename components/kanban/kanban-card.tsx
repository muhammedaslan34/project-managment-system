'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, Paperclip, CircleAlert as AlertCircle, Clock, Circle, GripVertical } from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'
import { Task } from '@/lib/types'

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
}

export function KanbanCard({ task, isDragging = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  }

  const priorityIcons = {
    low: Circle,
    medium: Clock,
    high: AlertCircle,
    urgent: AlertCircle,
  }

  const PriorityIcon = priorityIcons[task.priority]

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isSortableDragging || isDragging ? 'opacity-50 shadow-lg' : ''
      } ${isOverdue ? 'border-red-200' : ''}`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Header with drag handle and priority */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex items-center gap-1">
                <PriorityIcon className={`h-3 w-3 ${
                  task.priority === 'low' ? 'text-green-600' :
                  task.priority === 'medium' ? 'text-yellow-600' :
                  task.priority === 'high' ? 'text-orange-600' :
                  'text-red-600'
                }`} />
                <span className="text-xs text-muted-foreground font-mono">
                  {task.project_id}-{task.id.slice(-4)}
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>

          {/* Task title */}
          <h4 className="font-medium text-sm leading-tight line-clamp-2">
            {task.title}
          </h4>

          {/* Task description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 3).map((label) => (
                <Badge
                  key={label.id}
                  variant="secondary"
                  className="text-xs px-2 py-0"
                  style={{ backgroundColor: `${label.color}20`, color: label.color }}
                >
                  {label.name}
                </Badge>
              ))}
              {task.labels.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{task.labels.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task.comments.length}</span>
                </div>
              )}
              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
              {task.due_date && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}
            </div>

            {/* Assignee avatar */}
            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar_url} />
                <AvatarFallback className="text-xs">
                  {getInitials(task.assignee.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Story points */}
          {task.estimate_points && (
            <div className="flex justify-end">
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {task.estimate_points} pts
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}