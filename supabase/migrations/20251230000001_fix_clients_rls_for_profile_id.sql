-- Fix clients table RLS policies to use profile_id instead of user_id
-- This aligns with our frontend code that fetches profile_id from user_profiles

-- Drop existing clients policies
DROP POLICY IF EXISTS "clients_self_access" ON clients;
DROP POLICY IF EXISTS "clients_consultant_access" ON clients;

-- Create new policies using profile_id
-- Clients can access their own records using profile_id
CREATE POLICY "clients_profile_access" 
ON clients 
FOR ALL 
TO authenticated 
USING (
  profile_id IN (
    SELECT id FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'client'
  )
)
WITH CHECK (
  profile_id IN (
    SELECT id FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'client'
  )
);

-- Consultants can view their assigned clients using profile_id
CREATE POLICY "clients_consultant_view" 
ON clients 
FOR SELECT 
TO authenticated 
USING (
  assigned_consultant_id IN (
    SELECT id FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'consultant'
  )
);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
