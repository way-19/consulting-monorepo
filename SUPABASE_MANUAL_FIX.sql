-- ========================================
-- Supabase Production Database Fix
-- ========================================
-- RUN THIS IN: Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
--
-- This will:
-- 1. Create user_profiles for consultant and client
-- 2. Link them to auth users
-- 3. Create consultant-client assignment
-- ========================================

-- Step 1: Insert/Update user_profiles for consultant
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
SET 
    user_id = EXCLUDED.user_id,
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Step 2: Insert/Update user_profiles for client
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
SET 
    user_id = EXCLUDED.user_id,
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Step 3: Update consultant_profiles (if exists)
UPDATE consultant_profiles
SET 
    user_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    updated_at = NOW()
WHERE email = 'giorgi.meskhi@consulting19.com';

-- Step 4: Update clients table
UPDATE clients
SET 
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    profile_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    updated_at = NOW()
WHERE email = 'client@consulting19.com';

-- Step 5: Create user assignment (consultant -> client)
INSERT INTO user_assignments (consultant_id, client_id, status, notes)
SELECT 
    (SELECT id FROM consultant_profiles WHERE email = 'giorgi.meskhi@consulting19.com'),
    (SELECT id FROM clients WHERE email = 'client@consulting19.com'),
    'active',
    'Client assigned to consultant - Manual setup'
WHERE EXISTS (SELECT 1 FROM consultant_profiles WHERE email = 'giorgi.meskhi@consulting19.com')
  AND EXISTS (SELECT 1 FROM clients WHERE email = 'client@consulting19.com')
ON CONFLICT (consultant_id, client_id) DO UPDATE
SET 
    status = 'active',
    updated_at = NOW();

-- Verification Query (run this after)
-- Check if everything is set up correctly:
SELECT 
    'user_profiles' as table_name,
    id,
    user_id,
    email,
    COALESCE(first_name || ' ' || last_name, full_name, 'No name') as name,
    role
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com')

UNION ALL

SELECT 
    'Assignment' as table_name,
    ua.id,
    NULL as user_id,
    'Consultant: ' || cp.email || ' → Client: ' || c.email as email,
    ua.status as name,
    ua.notes as role
FROM user_assignments ua
JOIN consultant_profiles cp ON ua.consultant_id = cp.id
JOIN clients c ON ua.client_id = c.id
WHERE cp.email = 'giorgi.meskhi@consulting19.com'
  AND c.email = 'client@consulting19.com';
