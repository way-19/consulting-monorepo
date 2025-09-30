-- Create test user profiles for existing auth users
-- This migration creates profiles for the test users

-- Temporarily disable RLS to insert profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Insert user profiles for existing auth users
INSERT INTO user_profiles (user_id, email, first_name, last_name, role, phone) VALUES
('d6a4a19d-e45a-423e-9cfa-204f1cfec36c', 'admin@consulting19.com', 'Admin', 'User', 'admin', '+1234567890'),
('2efa54a0-08a4-49e3-9ccb-d63adf2db2c0', 'giorgi.meskhi@consulting19.com', 'Giorgi', 'Meskhi', 'consultant', '+995555123456'),
('44175993-eda1-42e7-ab18-bba2f16d721b', 'client@consulting19.com', 'Test', 'Client', 'client', '+1987654321')
ON CONFLICT (user_id) DO NOTHING;

-- Create client record using the original table structure
INSERT INTO clients (
    user_id,
    first_name,
    last_name,
    email,
    phone,
    company_name,
    country_code,
    preferred_language
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'client@consulting19.com'),
    'Test',
    'Client',
    'client@consulting19.com',
    '+1987654321',
    'Test Company Ltd',
    'US',
    'en'
) ON CONFLICT (email) DO NOTHING;

-- User assignment will be handled separately if needed

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;