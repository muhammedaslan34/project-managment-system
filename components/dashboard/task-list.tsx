import { CircleCheck as CheckCircle2, Circle, Clock, CircleAlert as AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getInitials } from '@/lib/utils'
import { Task } from '@/lib/types'

interface TaskListProps {
  tasks: Task[]
  title: string
}

export function TaskList({ tasks, title }: TaskListProps) {
  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  }

  const priorityIcons = {
    low: Circle,
    medium: Clock,
    high: AlertCircle,
    urgent: AlertCircle,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks found</p>
          ) : (
            tasks.map((task) => {
              const PriorityIcon = priorityIcons[task.priority]
              return (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {task.status === 'done' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <PriorityIcon className={`h-4 w-4 ${priorityColors[task.priority]}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="font-mono">{task.project_id}</span>
                      {task.due_date && (
                        <span>Due {formatDate(task.due_date)}</span>
                      )}
                    </div>
                  </div>
                  
                  {task.assignee && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {getInitials(task.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}