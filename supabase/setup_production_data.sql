-- Production Supabase Setup
-- Run this in your Supabase Dashboard SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Create user_profiles for consultant (using only basic columns)
INSERT INTO user_profiles (id, user_id, email, first_name, last_name, role, is_active)
VALUES (
    '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    'giorgi.meskhi@consulting19.com',
    'Giorgi',
    'Meskhi',
    'consultant',
    true
)
ON CONFLICT (id) DO UPDATE
SET user_id = EXCLUDED.user_id,
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 2. Create user_profiles for client (using only basic columns)
INSERT INTO user_profiles (id, user_id, email, first_name, last_name, role, is_active)
VALUES (
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    'client@consulting19.com',
    'Test',
    'Client',
    'client',
    true
)
ON CONFLICT (id) DO UPDATE
SET user_id = EXCLUDED.user_id,
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. Update consultant_profiles with user_id (consultant already exists)
UPDATE consultant_profiles
SET user_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    updated_at = NOW()
WHERE email = 'giorgi.meskhi@consulting19.com';

-- 4. Update or Insert clients
INSERT INTO clients (user_id, profile_id, email, first_name, last_name, company_name, preferred_language)
VALUES (
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    'client@consulting19.com',
    'Test',
    'Client',
    'Test Company LLC',
    'en'
)
ON CONFLICT (email) DO UPDATE
SET user_id = EXCLUDED.user_id,
    profile_id = EXCLUDED.profile_id,
    updated_at = NOW();

-- 5. Create user assignment (consultant -> client)
INSERT INTO user_assignments (consultant_id, client_id, status, notes)
SELECT 
    cp.id as consultant_id,
    c.id as client_id,
    'active' as status,
    'Client assigned to consultant'
FROM consultant_profiles cp
CROSS JOIN clients c
WHERE cp.email = 'giorgi.meskhi@consulting19.com'
    AND c.email = 'client@consulting19.com'
ON CONFLICT (consultant_id, client_id) DO UPDATE
SET status = 'active',
    updated_at = NOW();

-- Verify the setup
SELECT 
    'user_profiles' as table_name,
    id,
    user_id,
    email,
    full_name,
    role
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com')
UNION ALL
SELECT 
    'user_assignments' as table_name,
    ua.id,
    NULL as user_id,
    'consultant: ' || cp.email || ' -> client: ' || c.email as email,
    ua.status as full_name,
    ua.notes as role
FROM user_assignments ua
JOIN consultant_profiles cp ON ua.consultant_id = cp.id
JOIN clients c ON ua.client_id = c.id;
