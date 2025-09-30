-- ========================================
-- ADIM ADIM ÇÖZÜM
-- ========================================
-- Her adımı ayrı çalıştırın ve sonucunu kontrol edin
-- ========================================

-- ADIM 1: Önce mevcut durumu kontrol edelim
SELECT 'MEVCUT DURUM' as info;

SELECT 'user_profiles' as tablo, id, email, user_id, role
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');

-- ADIM 2: Consultant'ı UPDATE et (bu çalışmalı)
UPDATE user_profiles
SET 
    user_id = '2efa54a0-08a4-49e3-9ccb-d63adf2db2c0',
    role = 'consultant',
    is_active = true,
    updated_at = NOW()
WHERE email = 'giorgi.meskhi@consulting19.com';

SELECT '✅ Consultant updated' as status;

-- ADIM 3: Client için user_profiles kaydı var mı kontrol et
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM user_profiles WHERE email = 'client@consulting19.com')
        THEN '✅ Client profile EXISTS'
        ELSE '❌ Client profile MISSING - we need to INSERT'
    END as client_status;

-- ADIM 4: Eğer client profili yoksa, email constraint'i ignore ederek ekleyelim
-- Bu SQL'i sadece yukarıdaki sonuç "MISSING" ise çalıştırın:
-- (Şimdilik sadece kontrol ediyoruz)

-- ADIM 5: clients tablosunu kontrol et
SELECT 'clients' as tablo, id, email, user_id, profile_id
FROM clients
WHERE email = 'client@consulting19.com';

-- SONUÇ: Bize şunu söyleyin:
-- 1. user_profiles'da client@consulting19.com var mı?
-- 2. clients tablosunda kayıt var mı?
