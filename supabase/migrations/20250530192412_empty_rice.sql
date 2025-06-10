-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'visitor',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email
CREATE INDEX user_profiles_email_idx ON user_profiles(email);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for anyone"
  ON public.user_profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update for super admins"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) IN ('president', 'secretary_general')
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();