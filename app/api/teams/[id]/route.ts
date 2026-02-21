import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/api-response';
import { updateTeamSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: team, error } = await supabase
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
        projects:projects(id, name, status, priority, created_at)
      `)
      .eq('id', params.id)
      .maybeSingle();

    if (error || !team) {
      return notFoundResponse('Team not found');
    }

    return successResponse(team);
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
    const validation = updateTeamSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { data: existingTeam, error: fetchError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingTeam) {
      return notFoundResponse('Team not found');
    }

    const { data: team, error } = await supabase
      .from('teams')
      .update(validation.data)
      .eq('id', params.id)
      .select(`
        *,
        owner:users!teams_owner_id_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to update team', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'team',
      entity_id: team.id,
      action: 'updated',
      changes: validation.data,
    });

    return successResponse(team);
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

    const { data: existingTeam, error: fetchError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingTeam) {
      return notFoundResponse('Team not found');
    }

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', params.id);

    if (error) {
      return errorResponse('Failed to delete team', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'team',
      entity_id: params.id,
      action: 'deleted',
      changes: { team_name: existingTeam.name },
    });

    return successResponse({ message: 'Team deleted successfully' });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
