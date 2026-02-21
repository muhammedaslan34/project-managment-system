import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createCommentSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const taskId = searchParams.get('task_id');

    let query = supabase
      .from('comments')
      .select(`
        *,
        user:users(id, full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: true });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    const { data: comments, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch comments', 500);
    }

    return successResponse(comments);
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
    const validation = createCommentSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    if (!validation.data.project_id && !validation.data.task_id) {
      return errorResponse('Either project_id or task_id must be provided', 400);
    }

    const commentData = {
      ...validation.data,
      user_id: user.userId,
    };

    const { data: comment, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        user:users(id, full_name, email, avatar_url)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to create comment', 500);
    }

    const entityType = validation.data.project_id ? 'project' : 'task';
    const entityId = validation.data.project_id || validation.data.task_id;

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: entityType,
      entity_id: entityId!,
      action: 'comment_added',
      changes: { comment_preview: comment.content.substring(0, 50) },
    });

    return successResponse(comment, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
