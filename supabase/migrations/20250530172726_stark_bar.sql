-- First add the column as nullable
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Update existing rows with email from auth.users
UPDATE user_profiles up
SET email = u.email
FROM auth.users u
WHERE up.user_id = u.id;

-- Now make it not null after data is populated
ALTER TABLE user_profiles 
ALTER COLUMN email SET NOT NULL;

-- Add unique constraint to email
ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_email_key UNIQUE (email);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles (email);