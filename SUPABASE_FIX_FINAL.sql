-- ========================================
-- FINAL Supabase Production Database Fix
-- ========================================
-- Sadece UPDATE ve koşullu INSERT kullanarak
-- ========================================

-- Step 1: user_profiles için email'e göre UPDATE (INSERT yok)
UPDATE user_profiles
SET 
    user_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    role = 'consultant',
    is_active = true,
    updated_at = NOW()
WHERE email = 'giorgi.meskhi@consulting19.com';

UPDATE user_profiles
SET 
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    role = 'client',
    is_active = true,
    updated_at = NOW()
WHERE email = 'client@consulting19.com';

-- Step 2: Eğer kayıtlar yoksa ekle (email unique constraint olmayan ID ile)
INSERT INTO user_profiles (id, user_id, email, first_name, last_name, role, is_active)
SELECT 
    '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    'giorgi.meskhi@consulting19.com',
    'Giorgi',
    'Meskhi',
    'consultant',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com'
);

INSERT INTO user_profiles (id, user_id, email, first_name, last_name, role, is_active)
SELECT 
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    'client@consulting19.com',
    'Test',
    'Client',
    'client',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE email = 'client@consulting19.com'
);

-- Step 3: clients tablosu varsa güncelle
UPDATE clients
SET 
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    profile_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    updated_at = NOW()
WHERE email = 'client@consulting19.com';

-- Eğer client yoksa ekle
INSERT INTO clients (id, user_id, profile_id, email, first_name, last_name, company_name, preferred_language)
SELECT 
    gen_random_uuid(),
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    '44175993-eda1-42e7-ab18-bba2f16d721b',
    'client@consulting19.com',
    'Test',
    'Client',
    'Test Company LLC',
    'en'
WHERE NOT EXISTS (
    SELECT 1 FROM clients WHERE email = 'client@consulting19.com'
);

-- Step 4: user_assignments oluştur
INSERT INTO user_assignments (consultant_id, client_id, status, notes)
SELECT 
    (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
    (SELECT id FROM clients WHERE email = 'client@consulting19.com' LIMIT 1),
    'active',
    'Client assigned to consultant'
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com')
  AND EXISTS (SELECT 1 FROM clients WHERE email = 'client@consulting19.com')
  AND NOT EXISTS (
    SELECT 1 FROM user_assignments 
    WHERE consultant_id = (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1)
      AND client_id = (SELECT id FROM clients WHERE email = 'client@consulting19.com' LIMIT 1)
  );

-- Verification: Sonuçları kontrol et
SELECT 
    'user_profiles' as source,
    id,
    user_id,
    email,
    COALESCE(first_name || ' ' || last_name, full_name) as name,
    role
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com')

UNION ALL

SELECT 
    'clients' as source,
    c.id,
    c.user_id,
    c.email,
    c.first_name || ' ' || c.last_name as name,
    'client' as role
FROM clients c
WHERE c.email = 'client@consulting19.com'

UNION ALL

SELECT 
    'assignment' as source,
    ua.id,
    NULL as user_id,
    up.email || ' → ' || c.email as email,
    ua.status as name,
    'active' as role
FROM user_assignments ua
JOIN user_profiles up ON ua.consultant_id = up.id
JOIN clients c ON ua.client_id = c.id
WHERE up.email = 'giorgi.meskhi@consulting19.com'
  AND c.email = 'client@consulting19.com';
