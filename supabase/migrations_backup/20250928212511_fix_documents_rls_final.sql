-- Fix documents RLS policies to work with new table structure
-- Remove user_profiles dependencies and use consultant_profiles/clients tables

-- Drop all existing documents policies
DROP POLICY IF EXISTS "documents_client_access" ON documents;
DROP POLICY IF EXISTS "documents_consultant_access" ON documents;
DROP POLICY IF EXISTS "documents_admin_access" ON documents;
DROP POLICY IF EXISTS "documents_consultant_insert" ON documents;
DROP POLICY IF EXISTS "documents_consultant_update_own" ON documents;

-- 1. Client'lar kendi dökümanlarını görebilir ve yönetebilir
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

-- 2. Consultant'lar atanmış client'larının dökümanlarını görebilir ve yönetebilir
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

-- 3. Service role için tam erişim (admin işlemleri için)
CREATE POLICY "documents_service_role_access" 
ON documents 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON TABLE documents IS 'Documents table with updated RLS policies for consultant_profiles and clients tables';