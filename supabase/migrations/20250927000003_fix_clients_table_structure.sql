-- Fix clients table structure to match application expectations
-- This migration aligns the clients table with the TypeScript interfaces

-- Add missing columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS assigned_consultant_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON clients(profile_id);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_consultant_id ON clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority);

-- Update existing clients to set profile_id based on user_id
-- This assumes that each client has a corresponding user_profile
UPDATE clients 
SET profile_id = (
    SELECT id FROM user_profiles 
    WHERE user_profiles.user_id = clients.user_id 
    AND user_profiles.role = 'client'
    LIMIT 1
)
WHERE profile_id IS NULL;

-- Add RLS policies for the new structure
CREATE POLICY "Clients can view own data via profile_id" ON clients
    FOR SELECT USING (
        profile_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Consultants can view assigned clients" ON clients
    FOR SELECT USING (
        assigned_consultant_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid() AND role = 'consultant'
        )
    );

CREATE POLICY "Admins can view all clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Add comment to document the change
COMMENT ON TABLE clients IS 'Client information table updated to match application expectations with profile_id and consultant assignment support';
