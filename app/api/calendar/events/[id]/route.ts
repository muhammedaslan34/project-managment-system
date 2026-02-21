import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/api-response';
import { updateEventSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: event, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        team:teams(id, name, description),
        project:projects(id, name),
        task:tasks(id, title),
        creator:users!calendar_events_created_by_fkey(id, full_name, email, avatar_url),
        attendees:event_attendees(
          id,
          status,
          user:users(id, full_name, email, avatar_url)
        )
      `)
      .eq('id', params.id)
      .maybeSingle();

    if (error || !event) {
      return notFoundResponse('Event not found');
    }

    return successResponse(event);
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
    const validation = updateEventSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { data: existingEvent, error: fetchError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingEvent) {
      return notFoundResponse('Event not found');
    }

    const { data: event, error } = await supabase
      .from('calendar_events')
      .update(validation.data)
      .eq('id', params.id)
      .select(`
        *,
        team:teams(id, name),
        project:projects(id, name),
        creator:users!calendar_events_created_by_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to update event', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'event',
      entity_id: event.id,
      action: 'updated',
      changes: validation.data,
    });

    return successResponse(event);
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

    const { data: existingEvent, error: fetchError } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !existingEvent) {
      return notFoundResponse('Event not found');
    }

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', params.id);

    if (error) {
      return errorResponse('Failed to delete event', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'event',
      entity_id: params.id,
      action: 'deleted',
      changes: { event_title: existingEvent.title },
    });

    return successResponse({ message: 'Event deleted successfully' });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
