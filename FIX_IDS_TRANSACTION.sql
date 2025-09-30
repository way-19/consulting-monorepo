-- ========================================
-- ID'leri Düzelt: Transaction İçinde
-- ========================================
-- Önce foreign key'leri güncelle, sonra primary key'i
-- ========================================

BEGIN;

-- Step 1: clients tablosundaki tüm referansları güncelle
UPDATE clients
SET 
    assigned_consultant_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    profile_id = '44175993-eda1-42e7-ab18-bba2f16d721b'
WHERE email = 'client@consulting19.com';

-- Step 2: user_assignments tablosundaki referansları güncelle
UPDATE user_assignments
SET 
    consultant_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    client_id = '44175993-eda1-42e7-ab18-bba2f16d721b'
WHERE consultant_id = '16185a62-2d14-4a9d-aa3e-32d1235eca0c'
   OR client_id = '7705f317-931e-4987-8ca8-d8bb50b8f056';

-- Step 3: Şimdi user_profiles'daki ID'leri güncelle
UPDATE user_profiles 
SET id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0'
WHERE email = 'giorgi.meskhi@consulting19.com';

UPDATE user_profiles 
SET id = '44175993-eda1-42e7-ab18-bba2f16d721b'
WHERE email = 'client@consulting19.com';

COMMIT;

-- Verification
SELECT '✅ VERIFICATION' as status;

SELECT 'user_profiles' as tablo, id, user_id, email, role
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');

SELECT 'clients' as tablo, id, user_id, profile_id, assigned_consultant_id, email
FROM clients
WHERE email = 'client@consulting19.com';

SELECT 'user_assignments' as tablo, id, consultant_id, client_id, status
FROM user_assignments;
