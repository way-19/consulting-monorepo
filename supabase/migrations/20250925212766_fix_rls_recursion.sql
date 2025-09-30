-- Fix infinite recursion in user_profiles RLS policies
-- The issue is that admin policies check user_profiles table which creates circular dependency

-- Drop all existing policies
DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_delete" ON user_profiles;

-- Create a function to check if user is admin using auth.jwt() instead of user_profiles
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from JWT token
  user_email := auth.jwt() ->> 'email';
  
  -- Check if email is admin email
  RETURN user_email = 'admin@consulting19.com';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- Policy 1: Users can view and update their own profile
CREATE POLICY "user_profiles_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Admin can view all profiles (using email check instead of role check)
CREATE POLICY "user_profiles_admin_select" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (is_admin());

-- Policy 3: Admin can insert profiles
CREATE POLICY "user_profiles_admin_insert" 
ON user_profiles 
FOR INSERT
TO authenticated 
WITH CHECK (is_admin());

-- Policy 4: Admin can update profiles
CREATE POLICY "user_profiles_admin_update" 
ON user_profiles 
FOR UPDATE
TO authenticated 
USING (is_admin())
WITH CHECK (is_admin());

-- Policy 5: Admin can delete profiles
CREATE POLICY "user_profiles_admin_delete" 
ON user_profiles 
FOR DELETE
TO authenticated 
USING (is_admin());

-- Add comment
COMMENT ON FUNCTION is_admin IS 'Check if current user is admin using JWT email instead of user_profiles to avoid recursion';
