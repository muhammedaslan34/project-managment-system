export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  org_id: string
  role: UserRole
  created_at: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro' | 'enterprise'
  created_at: Date
}

export interface Workspace {
  id: string
  org_id: string
  name: string
  key: string
  is_default: boolean
  created_at: Date
}

export interface Project {
  id: string
  workspace_id: string
  name: string
  key: string
  description?: string
  status: ProjectStatus
  start_date?: Date
  end_date?: Date
  visibility: 'private' | 'internal' | 'public'
  created_by: string
  created_at: Date
  boards?: Board[]
  members?: ProjectMember[]
}

export interface Board {
  id: string
  project_id: string
  name: string
  is_default: boolean
  sort_order: number
  columns?: Column[]
}

export interface Column {
  id: string
  board_id: string
  name: string
  wip_limit?: number
  sort_order: number
  tasks?: Task[]
}

export interface Task {
  id: string
  project_id: string
  board_id: string
  column_id: string
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  estimate_points?: number
  due_date?: Date
  start_date?: Date
  created_by: string
  assignee_id?: string
  sort_order: number
  archived: boolean
  created_at: Date
  assignee?: User
  labels?: TaskLabel[]
  comments?: Comment[]
  attachments?: Attachment[]
}

export interface TaskLabel {
  id: string
  org_id: string
  name: string
  color: string
}

export interface Comment {
  id: string
  task_id: string
  author_id: string
  body: string
  mentions: string[]
  created_at: Date
  author?: User
}

export interface Attachment {
  id: string
  task_id: string
  project_id: string
  uploader_id: string
  file_key: string
  file_name: string
  size: number
  mime: string
  created_at: Date
  uploader?: User
}

export interface Sprint {
  id: string
  project_id: string
  name: string
  goal?: string
  start_date: Date
  end_date: Date
  state: SprintState
  tasks?: Task[]
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: ProjectRole
  user?: User
}

export type UserRole = 'owner' | 'admin' | 'pm' | 'member' | 'client'
export type ProjectRole = 'pm' | 'contributor' | 'viewer' | 'client'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type TaskType = 'story' | 'task' | 'bug' | 'epic'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SprintState = 'planned' | 'active' | 'closed'