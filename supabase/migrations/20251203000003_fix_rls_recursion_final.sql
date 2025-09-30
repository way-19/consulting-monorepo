-- Fix infinite recursion in user_profiles RLS policies
-- The issue is that policies are referencing the same table they're protecting

-- First, drop ALL existing policies on user_profiles to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_select" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_insert" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_delete" ON user_profiles;
DROP POLICY IF EXISTS "users_can_view_profiles" ON user_profiles;
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients_profiles" ON user_profiles;
DROP POLICY IF EXISTS "clients_can_view_assigned_consultant" ON user_profiles;
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients" ON user_profiles;

-- Create a simple, non-recursive policy for user_profiles
-- Users can only view and manage their own profile
CREATE POLICY "user_profiles_self_access" 
ON user_profiles 
FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- For cross-user access, we'll use a simpler approach without recursion
-- Allow all authenticated users to view basic profile info (needed for client-consultant relationships)
CREATE POLICY "user_profiles_basic_read" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Fix clients table policies to avoid recursion
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients" ON clients;
DROP POLICY IF EXISTS "users_can_view_clients" ON clients;
DROP POLICY IF EXISTS "consultants_can_view_client_details" ON clients;

-- Simple clients table policy
CREATE POLICY "clients_self_access" 
ON clients 
FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Consultants can view their assigned clients (using direct user_id check)
CREATE POLICY "clients_consultant_access" 
ON clients 
FOR SELECT 
TO authenticated 
USING (assigned_consultant_id = auth.uid());

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
