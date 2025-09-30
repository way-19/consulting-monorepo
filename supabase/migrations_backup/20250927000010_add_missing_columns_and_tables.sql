-- Add missing columns and tables for production data import
-- This migration adds the backup_codes column to user_profiles and creates consultant_assignments table

-- Add backup_codes column to user_profiles (for 2FA backup codes)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS backup_codes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS country_id UUID,
ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS storage_limit_gb INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_file_activity TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mfa_secret TEXT,
ADD COLUMN IF NOT EXISTS mfa_enrolled_at TIMESTAMP WITH TIME ZONE;

-- Drop the generated full_name column and recreate as regular column
ALTER TABLE user_profiles DROP COLUMN IF EXISTS full_name;
ALTER TABLE user_profiles ADD COLUMN full_name VARCHAR(255);

-- Add first_name and last_name columns if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);

-- Create consultant_assignments table for client-consultant relationships
CREATE TABLE IF NOT EXISTS consultant_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique active assignment per client
    UNIQUE(client_id, consultant_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultant_assignments_client_id ON consultant_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_consultant_assignments_consultant_id ON consultant_assignments(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_assignments_is_active ON consultant_assignments(is_active);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_consultant_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consultant_assignments_updated_at_trigger
    BEFORE UPDATE ON consultant_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_consultant_assignments_updated_at();

-- RLS Policies for consultant_assignments
ALTER TABLE consultant_assignments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own assignments (as consultant or client)
CREATE POLICY "consultant_assignments_own_access" 
ON consultant_assignments 
FOR SELECT 
TO authenticated 
USING (
    consultant_id = auth.uid() 
    OR 
    EXISTS (
        SELECT 1 FROM clients c 
        WHERE c.id = client_id 
        AND c.profile_id = auth.uid()
    )
);

-- Policy 2: Admins can view and manage all assignments
CREATE POLICY "consultant_assignments_admin_access" 
ON consultant_assignments 
FOR ALL 
TO authenticated 
USING (is_admin())
WITH CHECK (is_admin());

-- Policy 3: Consultants can view their assignments
CREATE POLICY "consultant_assignments_consultant_view" 
ON consultant_assignments 
FOR SELECT 
TO authenticated 
USING (consultant_id = auth.uid());

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON consultant_assignments TO authenticated;

-- Add comments
COMMENT ON TABLE consultant_assignments IS 'Client-consultant assignment relationships';
COMMENT ON COLUMN user_profiles.backup_codes IS '2FA backup codes stored as JSON array';