import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword, generateToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { registerSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { email, password, full_name } = validation.data;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return errorResponse('User with this email already exists', 409);
    }

    const password_hash = await hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        full_name,
        role: 'member',
      })
      .select('id, email, full_name, role, created_at')
      .single();

    if (error) {
      return errorResponse('Failed to create user', 500);
    }

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return successResponse(
      {
        user: newUser,
        token,
      },
      201
    );
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
