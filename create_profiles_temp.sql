-- Temporarily disable RLS to create user profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Insert user profiles for existing auth users
INSERT INTO user_profiles (user_id, email, first_name, last_name, role, phone) VALUES
('d6a4a19d-e45a-423e-9cfa-204f1cfec36c', 'admin@consulting19.com', 'Admin', 'User', 'admin', '+1234567890'),
('2efa54a0-08a4-49e3-9ccb-d63adf2db2c0', 'giorgi.meskhi@consulting19.com', 'Giorgi', 'Meskhi', 'consultant', '+995555123456'),
('44175993-eda1-42e7-ab18-bba2f16d721b', 'client@consulting19.com', 'Test', 'Client', 'client', '+1987654321')
ON CONFLICT (user_id) DO NOTHING;

-- Create client record
INSERT INTO clients (profile_id, company_name, industry, target_countries, assigned_consultant_id, status)
SELECT 
  up_client.id,
  'Test Company Ltd',
  'Technology',
  ARRAY['United States', 'United Kingdom'],
  up_consultant.id,
  'active'
FROM user_profiles up_client
CROSS JOIN user_profiles up_consultant
WHERE up_client.email = 'client@consulting19.com'
  AND up_consultant.email = 'giorgi.meskhi@consulting19.com'
ON CONFLICT DO NOTHING;

-- Create user assignment
INSERT INTO user_assignments (consultant_id, client_id, assigned_at)
SELECT 
  up_consultant.id,
  up_client.id,
  NOW()
FROM user_profiles up_client
CROSS JOIN user_profiles up_consultant
WHERE up_client.email = 'client@consulting19.com'
  AND up_consultant.email = 'giorgi.meskhi@consulting19.com'
ON CONFLICT DO NOTHING;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;