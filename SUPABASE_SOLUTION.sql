-- ========================================
-- ÇÖZÜM: Email'e göre upsert + ID güncelleme
-- ========================================
-- Kayıtlar zaten var, sadece user_id'leri güncelleyip bağlantı kuracağız
-- ========================================

BEGIN;

-- Step 1: Email'e göre user_profiles kayıtlarını upsert (mevcut kaydı güncelle)
INSERT INTO user_profiles (email, first_name, last_name, role, is_active, user_id)
VALUES 
    ('giorgi.meskhi@consulting19.com', 'Giorgi', 'Meskhi', 'consultant', true, '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0')
ON CONFLICT (email) DO UPDATE
SET 
    user_id = EXCLUDED.user_id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO user_profiles (email, first_name, last_name, role, is_active, user_id)
VALUES 
    ('client@consulting19.com', 'Test', 'Client', 'client', true, '44175993-eda1-42e7-ab18-bba2f16d721b')
ON CONFLICT (email) DO UPDATE
SET 
    user_id = EXCLUDED.user_id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Step 2: user_profiles'daki ID'leri al ve clients tablosunu güncelle
UPDATE clients
SET 
    profile_id = (SELECT id FROM user_profiles WHERE email = 'client@consulting19.com'),
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    updated_at = NOW()
WHERE email = 'client@consulting19.com';

-- Step 3: user_assignments oluştur (consultant -> client)
INSERT INTO user_assignments (consultant_id, client_id, status, notes)
SELECT 
    (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com'),
    (SELECT id FROM clients WHERE email = 'client@consulting19.com'),
    'active',
    'Client assigned to consultant - Production setup'
ON CONFLICT (consultant_id, client_id) DO UPDATE
SET 
    status = 'active',
    updated_at = NOW();

COMMIT;

-- Verification: Tüm kurulumu kontrol et
SELECT '✅ VERIFICATION' as status;

SELECT 
    'user_profiles' as tablo,
    id,
    user_id,
    email,
    role,
    is_active
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');

SELECT 
    'clients' as tablo,
    id,
    user_id,
    profile_id,
    email
FROM clients
WHERE email = 'client@consulting19.com';

SELECT 
    'user_assignments' as tablo,
    ua.id,
    up.email as consultant_email,
    c.email as client_email,
    ua.status
FROM user_assignments ua
JOIN user_profiles up ON ua.consultant_id = up.id
JOIN clients c ON ua.client_id = c.id
WHERE up.email = 'giorgi.meskhi@consulting19.com'
  AND c.email = 'client@consulting19.com';
