-- Fix authentication and user profile access policies
-- This migration addresses 403 and 500 errors in admin panel

-- First, ensure proper permissions for authenticated users on user_profiles
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Drop and recreate user_profiles policies with better error handling
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view and update their own profile
CREATE POLICY "user_profiles_own_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Admins can view all profiles
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

-- Policy 3: Admins can insert profiles
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

-- Policy 4: Admins can update profiles
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

-- Policy 5: Admins can delete profiles
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

-- Ensure auth schema permissions
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Create a function to safely get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  display_name text,
  role text,
  country_id uuid,
  phone text,
  company text,
  avatar_url text,
  preferred_language text,
  timezone text,
  is_active boolean,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.email,
    up.full_name,
    up.display_name,
    up.role,
    up.country_id,
    up.phone,
    up.company,
    up.avatar_url,
    up.preferred_language,
    up.timezone,
    up.is_active,
    up.metadata,
    up.created_at,
    up.updated_at
  FROM user_profiles up
  WHERE up.id = user_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_profile TO authenticated;

-- Add comment
COMMENT ON TABLE user_profiles IS 'User profiles with enhanced RLS policies for admin panel access';
