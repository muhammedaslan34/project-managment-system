/*
  # Add Public User Select Policy

  1. Changes
    - Add SELECT policy for users table to allow public user reading
    - This enables the API to check for existing users

  2. Security
    - Allows anyone to view users
    - Required for API to function properly
*/

-- Drop policy if it exists, then recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view users" ON users;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add policy to allow anyone to view users
CREATE POLICY "Anyone can view users"
  ON users
  FOR SELECT
  TO public
  USING (true);