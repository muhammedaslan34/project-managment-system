import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createProjectSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('team_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('projects')
      .select(`
        *,
        team:teams(id, name),
        creator:users!projects_created_by_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: projects, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch projects', 500);
    }

    return successResponse(projects);
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
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const projectData = {
      ...validation.data,
      created_by: user.userId,
    };

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        team:teams(id, name),
        creator:users!projects_created_by_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to create project', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'project',
      entity_id: project.id,
      action: 'created',
      changes: { project_name: project.name },
    });

    return successResponse(project, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
