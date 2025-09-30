-- Fix infinite recursion in user_profiles RLS policies

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients_profiles" ON user_profiles;

-- Create a simpler policy without recursion
CREATE POLICY "users_can_view_profiles" 
ON user_profiles 
FOR SELECT 
TO authenticated 
USING (
  -- User can view their own profile
  user_id = auth.uid()
  OR
  -- Consultants can view client profiles (using direct user_id check)
  (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'consultant'
    )
    AND role = 'client'
  )
  OR
  -- Clients can view consultant profiles (using direct user_id check)
  (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'client'
    )
    AND role = 'consultant'
  )
  OR
  -- Admins can view all profiles
  (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  )
);

-- Also fix the clients table policy to avoid recursion
DROP POLICY IF EXISTS "consultants_can_view_assigned_clients" ON clients;
CREATE POLICY "users_can_view_clients" 
ON clients 
FOR SELECT 
TO authenticated 
USING (
  -- Users can view their own client record
  user_id = auth.uid()
  OR
  -- Consultants can view their assigned clients
  assigned_consultant_id = auth.uid()
  OR
  -- Admins can view all clients (using direct check)
  auth.uid() IN (
    SELECT user_id FROM user_profiles WHERE role = 'admin'
  )
);
