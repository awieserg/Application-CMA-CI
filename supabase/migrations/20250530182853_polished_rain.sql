-- Create a trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_data user_profiles;
BEGIN
  -- Get the profile data that was inserted
  SELECT * INTO profile_data 
  FROM user_profiles 
  WHERE email = NEW.email;

  -- Create auth user with same email
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    profile_data.id,
    'authenticated',
    'authenticated',
    profile_data.email,
    profile_data.password_hash,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    json_build_object(
      'full_name', profile_data.full_name,
      'role', profile_data.role
    ),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Update the user_profiles with the auth user id
  UPDATE user_profiles
  SET user_id = profile_data.id
  WHERE id = profile_data.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;

-- Create trigger to handle new user registration
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- First disable RLS to drop all policies
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Allow anonymous signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "No one can read password_hash" ON user_profiles;
DROP POLICY IF EXISTS "Restrict password updates" ON user_profiles;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies
CREATE POLICY "Allow anonymous signup"
  ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND (up.role = 'president' OR up.role = 'secretary_general')
    )
  );

CREATE POLICY "No one can read password_hash"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (false);

CREATE POLICY "Restrict password updates"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);