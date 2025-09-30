-- FINAL FIX FOR RLS INFINITE RECURSION
-- The issue is admin policies that query user_profiles table causing circular dependency

-- Step 1: Drop ALL existing policies that might cause recursion
DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_delete" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "safe_select_policy" ON user_profiles;
DROP POLICY IF EXISTS "safe_insert_policy" ON user_profiles;
DROP POLICY IF EXISTS "safe_update_policy" ON user_profiles;

-- Step 2: Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create SIMPLE, NON-RECURSIVE policies
-- Policy 1: Users can access their own profile (no recursion)
CREATE POLICY "simple_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Policy 2: Admin access using email (no table lookup, no recursion)
CREATE POLICY "simple_admin_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (
  auth.email() IN (
    'admin@consulting19.com', 
    'admin.temp@consulting19.com'
  )
) 
WITH CHECK (
  auth.email() IN (
    'admin@consulting19.com', 
    'admin.temp@consulting19.com'
  )
);

-- Step 5: Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- Step 6: Add comment
COMMENT ON TABLE user_profiles IS 'User profiles with NON-RECURSIVE RLS policies - fixed infinite recursion';
