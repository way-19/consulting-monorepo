-- Fix critical RLS security issue
-- Anonymous users should NOT have access to user_profiles table

-- First, revoke all permissions from anonymous role
REVOKE ALL ON user_profiles FROM anon;
REVOKE ALL ON user_profiles FROM public;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_delete" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can only access their own profile (authenticated users only)
CREATE POLICY "user_profiles_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Admin can view all profiles (authenticated users only)
CREATE POLICY "user_profiles_admin_select" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Policy 3: Admin can insert profiles (authenticated users only)
CREATE POLICY "user_profiles_admin_insert" 
ON user_profiles 
FOR INSERT
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Policy 4: Admin can update profiles (authenticated users only)
CREATE POLICY "user_profiles_admin_update" 
ON user_profiles 
FOR UPDATE
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Policy 5: Admin can delete profiles (authenticated users only)
CREATE POLICY "user_profiles_admin_delete" 
ON user_profiles 
FOR DELETE
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
    AND up.is_active = true
  )
);

-- Ensure only authenticated users have access to user_profiles
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles with strict RLS - no anonymous access allowed';
