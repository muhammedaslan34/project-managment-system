import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createTaskSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const assignedTo = searchParams.get('assigned_to');
    const status = searchParams.get('status');

    let query = supabase
      .from('tasks')
      .select('*')
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
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch tasks', 500);
    }

    return successResponse(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .limit(1)
      .maybeSingle();

    let projectId = body.project_id || existingProject?.id;

    if (!projectId) {
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .limit(1)
        .maybeSingle();

      let teamId = existingTeam?.id;

      if (!teamId) {
        const { data: newTeam } = await supabase
          .from('teams')
          .insert({ name: 'Default Team' })
          .select('id')
          .single();
        teamId = newTeam?.id;
      }

      const { data: newProject } = await supabase
        .from('projects')
        .insert({
          name: 'Default Project',
          key: 'DEF',
          team_id: teamId,
          status: 'active'
        })
        .select('id')
        .single();

      projectId = newProject?.id;
    }

    const taskData = {
      title: body.title,
      description: body.description || null,
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      project_id: projectId,
      due_date: body.due_date || null,
      position: 0
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse(`Failed to create task: ${error.message}`, 500);
    }

    return successResponse(task, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return errorResponse('Internal server error', 500);
  }
}
