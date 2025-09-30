-- Create user_assignments table
CREATE TABLE IF NOT EXISTS user_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(consultant_id, client_id)
);

-- Add RLS policies
ALTER TABLE user_assignments ENABLE ROW LEVEL SECURITY;

-- Consultants can see their own assignments
CREATE POLICY "Consultants can view their assignments" ON user_assignments
  FOR SELECT USING (
    consultant_id IN (
      SELECT id FROM consultant_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Clients can see their own assignments  
CREATE POLICY "Clients can view their assignments" ON user_assignments
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE user_id = auth.uid()
    )
  );

-- Admins can see all assignments
CREATE POLICY "Admins can view all assignments" ON user_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert test assignment
INSERT INTO user_assignments (consultant_id, client_id, status, notes)
SELECT 
  cp.id as consultant_id,
  c.id as client_id,
  'active' as status,
  'Initial test assignment' as notes
FROM consultant_profiles cp, clients c
WHERE cp.email = 'giorgi.meskhi@consulting19.com'
  AND c.email = 'client@consulting19.com'
ON CONFLICT (consultant_id, client_id) DO NOTHING;