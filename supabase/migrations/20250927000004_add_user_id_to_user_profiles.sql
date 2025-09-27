-- Add missing user_id column to user_profiles table
-- This column was present in the original consultant_profiles table but missing after rename

-- Add the user_id column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Add a unique constraint to ensure one profile per user
-- First, remove any potential duplicates (if any exist)
DELETE FROM user_profiles a USING user_profiles b 
WHERE a.id > b.id AND a.email = b.email;

-- Now add the unique constraint on email (which should map to user_id)
ALTER TABLE user_profiles 
ADD CONSTRAINT unique_user_profiles_email UNIQUE (email);

-- Update existing records to link user_id with email from auth.users
-- This will populate user_id for existing profiles
UPDATE user_profiles 
SET user_id = auth_users.id 
FROM auth.users auth_users 
WHERE user_profiles.email = auth_users.email 
AND user_profiles.user_id IS NULL;

-- Add comment to document the fix
COMMENT ON COLUMN user_profiles.user_id IS 'Foreign key to auth.users table, added to fix missing column issue';