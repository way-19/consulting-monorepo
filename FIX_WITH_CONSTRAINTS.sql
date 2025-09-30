-- ========================================
-- Foreign Key Constraint'leri Kaldır → Güncelle → Geri Ekle
-- ========================================

BEGIN;

-- Step 1: Foreign key constraint'leri geçici kaldır
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_profile_id_fkey;
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_assigned_consultant_id_fkey;
ALTER TABLE user_assignments DROP CONSTRAINT IF EXISTS user_assignments_consultant_id_fkey;
ALTER TABLE user_assignments DROP CONSTRAINT IF EXISTS user_assignments_client_id_fkey;

-- Step 2: Eski user_profiles kayıtlarını sil
DELETE FROM user_profiles WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');

-- Step 3: Doğru ID'lerle yeniden ekle
INSERT INTO user_profiles (id, user_id, email, first_name, last_name, role, is_active)
VALUES 
    ('2efa54a0-08a4-49e3-9ccb-d63adf2db2c0', '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0', 'giorgi.meskhi@consulting19.com', 'Giorgi', 'Meskhi', 'consultant', true),
    ('44175993-eda1-42e7-ab18-bba2f16d721b', '44175993-eda1-42e7-ab18-bba2f16d721b', 'client@consulting19.com', 'Test', 'Client', 'client', true);

-- Step 4: clients tablosunu güncelle
UPDATE clients
SET 
    profile_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    assigned_consultant_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b'
WHERE email = 'client@consulting19.com';

-- Step 5: user_assignments'ı güncelle
UPDATE user_assignments
SET 
    consultant_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    client_id = (SELECT id FROM clients WHERE email = 'client@consulting19.com')
WHERE EXISTS (SELECT 1 FROM clients WHERE email = 'client@consulting19.com');

-- Step 6: Foreign key constraint'leri geri ekle
ALTER TABLE clients 
    ADD CONSTRAINT clients_profile_id_fkey 
    FOREIGN KEY (profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE clients 
    ADD CONSTRAINT clients_assigned_consultant_id_fkey 
    FOREIGN KEY (assigned_consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE user_assignments 
    ADD CONSTRAINT user_assignments_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE user_assignments 
    ADD CONSTRAINT user_assignments_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

COMMIT;

-- Verification
SELECT '=== USER_PROFILES ===' as check;
SELECT id, user_id, email, role, first_name, last_name FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');

SELECT '=== CLIENTS ===' as check;
SELECT id, user_id, profile_id, assigned_consultant_id, email FROM clients
WHERE email = 'client@consulting19.com';

SELECT '=== USER_ASSIGNMENTS ===' as check;
SELECT ua.id, ua.consultant_id, ua.client_id, ua.status,
       up.email as consultant_email, c.email as client_email
FROM user_assignments ua
LEFT JOIN user_profiles up ON ua.consultant_id = up.id
LEFT JOIN clients c ON ua.client_id = c.id;
