-- ========================================
-- BASIT ÇÖZÜM: Sadece UPDATE
-- ========================================
-- Hiç INSERT yok, sadece mevcut kayıtları güncelliyoruz
-- ========================================

-- 1. user_profiles tablosundaki consultant kaydını güncelle
UPDATE user_profiles
SET 
    user_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    role = 'consultant',
    is_active = true,
    updated_at = NOW()
WHERE email = 'giorgi.meskhi@consulting19.com';

-- 2. user_profiles tablosundaki client kaydını güncelle (varsa)
UPDATE user_profiles
SET 
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    role = 'client',
    is_active = true,
    updated_at = NOW()
WHERE email = 'client@consulting19.com';

-- 3. clients tablosunu güncelle
UPDATE clients
SET 
    user_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    profile_id = '44175993-eda1-42e7-ab18-bba2f16d721b',
    updated_at = NOW()
WHERE email = 'client@consulting19.com';

-- 4. Sonuçları göster
SELECT 
    'UPDATE SUCCESS' as status,
    email,
    user_id,
    role
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');
