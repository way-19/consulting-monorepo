-- Fix documents table RLS policies to use correct column references
-- The original policies referenced non-existent columns

-- Drop existing policies
DROP POLICY IF EXISTS "documents_client_access" ON documents;
DROP POLICY IF EXISTS "documents_consultant_access" ON documents;
DROP POLICY IF EXISTS "documents_admin_access" ON documents;

-- Policy 1: Clients can view and manage their own documents
-- Use profile_id instead of user_id in clients table
CREATE POLICY "documents_client_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM clients c 
        JOIN user_profiles up ON up.id = c.profile_id
        WHERE c.id = client_id 
        AND up.user_id = auth.uid()
        AND up.role = 'client'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM clients c 
        JOIN user_profiles up ON up.id = c.profile_id
        WHERE c.id = client_id 
        AND up.user_id = auth.uid()
        AND up.role = 'client'
    )
);

-- Policy 2: Consultants can view and manage documents for their assigned clients
-- Use assigned_consultant_id from clients table
CREATE POLICY "documents_consultant_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM clients c
        JOIN user_profiles up ON up.id = c.assigned_consultant_id
        WHERE c.id = client_id
        AND up.user_id = auth.uid() 
        AND up.role = 'consultant'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM clients c
        JOIN user_profiles up ON up.id = c.assigned_consultant_id
        WHERE c.id = client_id
        AND up.user_id = auth.uid() 
        AND up.role = 'consultant'
    )
);

-- Policy 3: Admins can view and manage all documents
CREATE POLICY "documents_admin_access" 
ON documents 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Add comment
COMMENT ON TABLE documents IS 'Document management table with corrected RLS policies for consultant portal';
