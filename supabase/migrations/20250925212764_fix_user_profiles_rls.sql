-- Fix RLS policies for user_profiles table
-- This migration ensures proper access control for user profiles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view and update their own profile
CREATE POLICY "Users can manage own profile" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy 3: Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles with proper RLS policies for self-access and admin access';
