-- EMERGENCY RLS FIX FOR CRITICAL SECURITY ISSUE
-- Anonymous users currently have access to user_profiles table
-- This must be fixed immediately!

-- Step 1: Revoke all permissions from anonymous users
REVOKE ALL ON user_profiles FROM anon;
REVOKE ALL ON user_profiles FROM public;

-- Step 2: Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies to start fresh
DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_delete" ON user_profiles;

-- Step 4: Create secure policy for authenticated users only
CREATE POLICY "user_profiles_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Step 5: Create admin policy for viewing all profiles
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

-- Step 6: Grant permissions only to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- Step 7: Add comment for documentation
COMMENT ON TABLE user_profiles IS 'User profiles with strict RLS - no anonymous access allowed';

-- VERIFICATION QUERY (run after the above commands)
-- This should return 0 rows when run as anonymous user:
-- SELECT COUNT(*) FROM user_profiles;