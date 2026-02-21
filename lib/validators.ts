import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  team_id: z.string().uuid('Invalid team ID'),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'archived']).default('planning'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createTaskSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().optional(),
  estimated_hours: z.number().positive().optional(),
  actual_hours: z.number().positive().optional(),
  parent_task_id: z.string().uuid().optional(),
  position: z.number().int().default(0),
});

export const updateTaskSchema = createTaskSchema.partial();

export const createEventSchema = z.object({
  team_id: z.string().uuid('Invalid team ID'),
  project_id: z.string().uuid().optional(),
  task_id: z.string().uuid().optional(),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  event_type: z.enum(['meeting', 'deadline', 'milestone', 'reminder']).default('meeting'),
  start_time: z.string(),
  end_time: z.string(),
  location: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

export const addTeamMemberSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  role: z.enum(['owner', 'admin', 'member', 'viewer']).default('member'),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  project_id: z.string().uuid().optional(),
  task_id: z.string().uuid().optional(),
});
