/*
  # Fix RLS policies for default user access

  1. Security Updates
    - Update RLS policies on `johan_sessions` table to allow access for default user ID
    - Update RLS policies on `johan_settings` table to allow access for default user ID
    - Add policies for anon role to work with hardcoded user ID

  2. Changes Made
    - Modified existing policies to work with the default user ID
    - Added anon role policies for unauthenticated access
    - Ensured all CRUD operations work for the default user
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can insert own sessions" ON johan_sessions;
DROP POLICY IF EXISTS "Users can read own sessions" ON johan_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON johan_sessions;

DROP POLICY IF EXISTS "Users can insert own settings" ON johan_settings;
DROP POLICY IF EXISTS "Users can read own settings" ON johan_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON johan_settings;

-- Create new policies for johan_sessions that work with default user ID
CREATE POLICY "Allow default user sessions insert"
  ON johan_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow default user sessions select"
  ON johan_sessions
  FOR SELECT
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow default user sessions delete"
  ON johan_sessions
  FOR DELETE
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

-- Create new policies for johan_settings that work with default user ID
CREATE POLICY "Allow default user settings insert"
  ON johan_settings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow default user settings select"
  ON johan_settings
  FOR SELECT
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow default user settings update"
  ON johan_settings
  FOR UPDATE
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid)
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid);