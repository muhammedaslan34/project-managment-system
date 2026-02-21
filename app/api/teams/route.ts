import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createTeamSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        *,
        owner:users!teams_owner_id_fkey(id, full_name, email, avatar_url),
        members:team_members(
          id,
          role,
          joined_at,
          user:users(id, full_name, email, avatar_url)
        ),
        projects:projects(id, name, status, priority)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return errorResponse('Failed to fetch teams', 500);
    }

    return successResponse(teams);
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
    const validation = createTeamSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const teamData = {
      ...validation.data,
      owner_id: user.userId,
    };

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert(teamData)
      .select(`
        *,
        owner:users!teams_owner_id_fkey(id, full_name, email)
      `)
      .single();

    if (teamError) {
      return errorResponse('Failed to create team', 500);
    }

    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.userId,
        role: 'owner',
      });

    if (memberError) {
      return errorResponse('Failed to add owner to team', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'team',
      entity_id: team.id,
      action: 'created',
      changes: { team_name: team.name },
    });

    return successResponse(team, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
