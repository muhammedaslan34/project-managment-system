import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, notFoundResponse } from '@/lib/api-response';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', params.id)
      .eq('user_id', user.userId)
      .select()
      .maybeSingle();

    if (error || !notification) {
      return notFoundResponse('Notification not found');
    }

    return successResponse(notification);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
