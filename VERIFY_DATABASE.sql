-- Tüm durumu kontrol et
SELECT '=== USER_PROFILES ===' as check;
SELECT id, user_id, email, role, first_name, last_name
FROM user_profiles
WHERE email IN ('giorgi.meskhi@consulting19.com', 'client@consulting19.com');

SELECT '=== CLIENTS ===' as check;
SELECT id, user_id, profile_id, assigned_consultant_id, email, first_name, last_name
FROM clients
WHERE email = 'client@consulting19.com';

SELECT '=== USER_ASSIGNMENTS ===' as check;
SELECT 
    ua.id,
    ua.consultant_id,
    ua.client_id,
    ua.status,
    up.email as consultant_email,
    c.email as client_email
FROM user_assignments ua
LEFT JOIN user_profiles up ON ua.consultant_id = up.id
LEFT JOIN clients c ON ua.client_id = c.id;

SELECT '=== TABLE EXISTENCE ===' as check;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'consultant_profiles', 'clients', 'user_assignments')
ORDER BY table_name;
