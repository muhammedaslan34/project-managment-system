import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/api-response';
import { updateProjectSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        team:teams(id, name, description),
        creator:users!projects_created_by_fkey(id, full_name, email, avatar_url),
        tasks(id, title, status, priority, assigned_to, due_date)
      `)
      .eq('id', params.id)
      .maybeSingle();

    if (error || !project) {
      return notFoundResponse('Project not found');
    }

    return successResponse(project);
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
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingProject) {
      return notFoundResponse('Project not found');
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(validation.data)
      .eq('id', params.id)
      .select(`
        *,
        team:teams(id, name),
        creator:users!projects_created_by_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to update project', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'project',
      entity_id: project.id,
      action: 'updated',
      changes: validation.data,
    });

    return successResponse(project);
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

    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingProject) {
      return notFoundResponse('Project not found');
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id);

    if (error) {
      return errorResponse('Failed to delete project', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'project',
      entity_id: params.id,
      action: 'deleted',
      changes: { project_name: existingProject.name },
    });

    return successResponse({ message: 'Project deleted successfully' });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
