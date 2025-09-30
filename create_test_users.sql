-- Create test users for production
-- These users need to be created through Supabase Auth first, then we'll update their profiles

-- Insert user profiles for test accounts
-- Note: The user_id values need to be updated with actual auth.users IDs after creating users in Supabase Auth

-- Admin User Profile
INSERT INTO user_profiles (
  id,
  user_id,
  first_name,
  last_name,
  email,
  role,
  phone,
  specialization,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'ADMIN_USER_ID_PLACEHOLDER', -- This will be replaced with actual auth user ID
  'Admin',
  'User',
  'admin@consulting19.com',
  'admin',
  '+1234567890',
  'System Administration',
  NOW(),
  NOW()
);

-- Consultant User Profile (Giorgi Meskhi)
INSERT INTO user_profiles (
  id,
  user_id,
  first_name,
  last_name,
  email,
  role,
  phone,
  specialization,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'CONSULTANT_USER_ID_PLACEHOLDER', -- This will be replaced with actual auth user ID
  'Giorgi',
  'Meskhi',
  'giorgi.meskhi@consulting19.com',
  'consultant',
  '+995555123456',
  'International Business Formation',
  NOW(),
  NOW()
);

-- Client User Profile
INSERT INTO user_profiles (
  id,
  user_id,
  first_name,
  last_name,
  email,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'CLIENT_USER_ID_PLACEHOLDER', -- This will be replaced with actual auth user ID
  'Test',
  'Client',
  'client@consulting19.com',
  'client',
  '+1987654321',
  NOW(),
  NOW()
);

-- Create a client record for the test client
INSERT INTO clients (
  id,
  profile_id,
  company_name,
  industry,
  target_countries,
  assigned_consultant_id,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM user_profiles WHERE email = 'client@consulting19.com'),
  'Test Company Ltd',
  'Technology',
  ARRAY['United States', 'United Kingdom'],
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com'),
  'active',
  NOW(),
  NOW()
);

-- Create user assignment between consultant and client
INSERT INTO user_assignments (
  id,
  consultant_id,
  client_id,
  assigned_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com'),
  (SELECT id FROM user_profiles WHERE email = 'client@consulting19.com'),
  NOW(),
  NOW(),
  NOW()
);