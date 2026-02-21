import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/api-response';
import { updateTaskSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(id, name, status, team_id),
        assignee:users!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
        creator:users!tasks_created_by_fkey(id, full_name, email),
        subtasks:tasks!tasks_parent_task_id_fkey(id, title, status, assigned_to),
        parent_task:tasks!tasks_parent_task_id_fkey(id, title),
        dependencies:task_dependencies!task_dependencies_task_id_fkey(
          id,
          dependency_type,
          depends_on:tasks!task_dependencies_depends_on_task_id_fkey(id, title, status)
        ),
        comments(id, content, created_at, user:users(id, full_name, avatar_url))
      `)
      .eq('id', params.id)
      .maybeSingle();

    if (error || !task) {
      return notFoundResponse('Task not found');
    }

    return successResponse(task);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const validation = updateTaskSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingTask) {
      return notFoundResponse('Task not found');
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(validation.data)
      .eq('id', params.id)
      .select(`
        *,
        project:projects(id, name),
        assignee:users!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
        creator:users!tasks_created_by_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to update task', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'task',
      entity_id: task.id,
      action: 'updated',
      changes: validation.data,
    });

    if (
      validation.data.assigned_to &&
      validation.data.assigned_to !== existingTask.assigned_to &&
      validation.data.assigned_to !== user.userId
    ) {
      await supabase.from('notifications').insert({
        user_id: validation.data.assigned_to,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `You have been assigned to task: ${task.title}`,
        related_entity_type: 'task',
        related_entity_id: task.id,
        is_read: false,
      });
    }

    if (validation.data.status === 'done' && existingTask.status !== 'done' && existingTask.created_by !== user.userId) {
      await supabase.from('notifications').insert({
        user_id: existingTask.created_by,
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${task.title}" has been completed`,
        related_entity_type: 'task',
        related_entity_id: task.id,
        is_read: false,
      });
    }

    return successResponse(task);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: existingTask, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingTask) {
      return notFoundResponse('Task not found');
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id);

    if (error) {
      return errorResponse('Failed to delete task', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'task',
      entity_id: params.id,
      action: 'deleted',
      changes: { task_title: existingTask.title },
    });

    return successResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
