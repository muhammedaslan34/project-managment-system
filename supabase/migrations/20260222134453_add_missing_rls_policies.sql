/*
  # Add Missing RLS Policies for Public Access

  1. Changes
    - Add INSERT policy for users table to allow public user creation
    - This enables the API to create default users when needed

  2. Security
    - Allows anyone to insert users (needed for registration and default user creation)
    - Existing policies remain unchanged for security
*/

-- Drop policy if it exists, then recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can create users" ON users;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add policy to allow anyone to insert users
CREATE POLICY "Anyone can create users"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);