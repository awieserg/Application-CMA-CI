/*
  # Add RLS policies for user registration

  1. Changes
    - Enable RLS on user_profiles table
    - Add policy for anonymous users to insert new profiles
    - Add policy for authenticated users to read profiles
    - Add policy for users to update their own profiles
    - Add policy for super admins to manage all profiles

  2. Security
    - Anonymous users can only create new profiles (sign up)
    - Users can only read and update their own profiles
    - Super admins (president, secretary_general) can manage all profiles
*/

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create new profiles (sign up)
CREATE POLICY "Allow anonymous signup"
  ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Allow super admins to manage all profiles
CREATE POLICY "Super admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id::text = auth.uid()::text
      AND (up.role = 'president' OR up.role = 'secretary_general')
    )
  );