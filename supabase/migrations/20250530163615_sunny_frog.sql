-- Add password column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN password_hash TEXT NOT NULL;

-- Add password validation constraint
ALTER TABLE public.user_profiles 
ADD CONSTRAINT password_length_check CHECK (length(password_hash) >= 8);

-- Update RLS policies to protect password_hash
CREATE POLICY "No one can read password_hash"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (false);

-- Only allow password updates through secure channels
CREATE POLICY "Restrict password updates"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);