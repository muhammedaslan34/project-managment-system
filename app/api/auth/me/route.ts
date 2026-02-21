import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, avatar_url, created_at')
      .eq('id', user.userId)
      .maybeSingle();

    if (error || !userData) {
      return errorResponse('User not found', 404);
    }

    return successResponse(userData);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
