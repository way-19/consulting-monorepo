-- ========================================
-- clients Tablosuna assigned_consultant_id Ekle
-- ========================================

BEGIN;

-- Kolon ekle
ALTER TABLE clients 
ADD COLUMN assigned_consultant_id UUID;

-- Foreign key ekle
ALTER TABLE clients 
ADD CONSTRAINT clients_assigned_consultant_id_fkey 
FOREIGN KEY (assigned_consultant_id) 
REFERENCES user_profiles(id) 
ON DELETE SET NULL;

-- Mevcut client için consultant ata (user_assignments'dan al)
UPDATE clients c
SET assigned_consultant_id = ua.consultant_id
FROM user_assignments ua
WHERE ua.client_id = c.id;

COMMIT;

-- Verification
SELECT 
    c.id,
    c.email,
    c.profile_id,
    c.assigned_consultant_id,
    up.first_name || ' ' || up.last_name as consultant_name,
    up.email as consultant_email
FROM clients c
LEFT JOIN user_profiles up ON c.assigned_consultant_id = up.id
WHERE c.email = 'client@consulting19.com';
