-- Create missing tables: meetings and audit_logs

-- Drop existing tables if they exist to recreate them properly
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Meetings table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_type VARCHAR(50) DEFAULT 'consultation',
    status VARCHAR(20) DEFAULT 'scheduled',
    meeting_url TEXT,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meetings_client_id ON meetings(client_id);
CREATE INDEX idx_meetings_consultant_id ON meetings(consultant_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meetings_status ON meetings(status);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetings
CREATE POLICY "meetings_client_select" ON meetings
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "meetings_consultant_select" ON meetings
    FOR SELECT USING (
        consultant_id IN (
            SELECT id FROM user_profiles WHERE user_id = auth.uid() AND role = 'consultant'
        )
    );

CREATE POLICY "meetings_admin_all" ON meetings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for audit_logs
CREATE POLICY "audit_logs_own_select" ON audit_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "audit_logs_admin_all" ON audit_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "audit_logs_insert" ON audit_logs
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Add some sample data
INSERT INTO meetings (title, description, client_id, consultant_id, start_time, end_time, status)
SELECT 
    'Initial Consultation',
    'First meeting to discuss client needs and requirements',
    c.id,
    up.id,
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
    'scheduled'
FROM clients c
JOIN user_profiles up ON up.role = 'consultant'
WHERE c.assigned_consultant_id = up.id
LIMIT 3;