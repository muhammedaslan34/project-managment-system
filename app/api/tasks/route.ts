import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createTaskSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const assignedTo = searchParams.get('assigned_to');
    const status = searchParams.get('status');

    let query = supabase
      .from('tasks')
      .select(`
        *,
        project:projects(id, name, status),
        assignee:users!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
        creator:users!tasks_created_by_fkey(id, full_name, email),
        subtasks:tasks!tasks_parent_task_id_fkey(id, title, status)
      `)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: tasks, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch tasks', 500);
    }

    return successResponse(tasks);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const taskData = {
      ...validation.data,
      created_by: user.userId,
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select(`
        *,
        project:projects(id, name),
        assignee:users!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
        creator:users!tasks_created_by_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to create task', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'task',
      entity_id: task.id,
      action: 'created',
      changes: { task_title: task.title },
    });

    if (task.assigned_to && task.assigned_to !== user.userId) {
      await supabase.from('notifications').insert({
        user_id: task.assigned_to,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to task: ${task.title}`,
        related_entity_type: 'task',
        related_entity_id: task.id,
        is_read: false,
      });
    }

    return successResponse(task, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
