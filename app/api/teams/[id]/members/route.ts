import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { addTeamMemberSchema } from '@/lib/validators';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const validation = addTeamMemberSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { user_id, role } = validation.data;

    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', params.id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingMember) {
      return errorResponse('User is already a member of this team', 409);
    }

    const { data: member, error } = await supabase
      .from('team_members')
      .insert({
        team_id: params.id,
        user_id,
        role,
      })
      .select(`
        id,
        role,
        joined_at,
        user:users(id, full_name, email, avatar_url)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to add team member', 500);
    }

    await supabase.from('notifications').insert({
      user_id: user_id,
      type: 'team_invitation',
      title: 'Added to Team',
      message: 'You have been added to a new team',
      related_entity_type: 'team',
      related_entity_id: params.id,
      is_read: false,
    });

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'team',
      entity_id: params.id,
      action: 'member_added',
      changes: { added_user_id: user_id, role },
    });

    return successResponse(member, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
