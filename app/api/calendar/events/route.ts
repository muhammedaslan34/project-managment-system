import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { createEventSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('team_id');
    const projectId = searchParams.get('project_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const eventType = searchParams.get('event_type');

    let query = supabase
      .from('calendar_events')
      .select(`
        *,
        team:teams(id, name),
        project:projects(id, name),
        task:tasks(id, title),
        creator:users!calendar_events_created_by_fkey(id, full_name, email, avatar_url),
        attendees:event_attendees(
          id,
          status,
          user:users(id, full_name, email, avatar_url)
        )
      `)
      .order('start_time', { ascending: true });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    if (startDate) {
      query = query.gte('start_time', startDate);
    }

    if (endDate) {
      query = query.lte('end_time', endDate);
    }

    const { data: events, error } = await query;

    if (error) {
      return errorResponse('Failed to fetch events', 500);
    }

    return successResponse(events);
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
    const validation = createEventSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const eventData = {
      ...validation.data,
      created_by: user.userId,
    };

    const { data: event, error } = await supabase
      .from('calendar_events')
      .insert(eventData)
      .select(`
        *,
        team:teams(id, name),
        project:projects(id, name),
        creator:users!calendar_events_created_by_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      return errorResponse('Failed to create event', 500);
    }

    await supabase.from('activity_logs').insert({
      user_id: user.userId,
      entity_type: 'event',
      entity_id: event.id,
      action: 'created',
      changes: { event_title: event.title },
    });

    return successResponse(event, 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
