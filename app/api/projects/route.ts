import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createProjectSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('team_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch projects', 500);
    }

    return successResponse(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id')
      .limit(1)
      .maybeSingle();

    let teamId = existingTeam?.id;

    if (!teamId) {
      const { data: newTeam, error: teamError } = await supabase
        .from('teams')
        .insert({ name: 'Default Team' })
        .select('id')
        .single();

      if (teamError || !newTeam) {
        return errorResponse('Failed to create team', 500);
      }
      teamId = newTeam.id;
    }

    const projectData = {
      name: body.name,
      key: body.key,
      description: body.description || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      team_id: teamId,
      status: 'planning'
    };

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse(`Failed to create project: ${error.message}`, 500);
    }

    return successResponse(project, 201);
  } catch (error) {
    console.error('Error creating project:', error);
    return errorResponse('Internal server error', 500);
  }
}
