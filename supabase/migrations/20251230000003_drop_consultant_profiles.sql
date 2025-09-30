-- Drop consultant_profiles table completely as it's been replaced by user_profiles

-- First drop any remaining foreign key constraints that reference consultant_profiles
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Find and drop all foreign key constraints that reference consultant_profiles
    FOR r IN (
        SELECT 
            tc.table_name, 
            tc.constraint_name
        FROM 
            information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu 
                ON ccu.constraint_name = tc.constraint_name
        WHERE 
            tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.table_name = 'consultant_profiles'
    ) LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', r.table_name, r.constraint_name);
    END LOOP;
END $$;

-- Drop the consultant_profiles table
DROP TABLE IF EXISTS consultant_profiles CASCADE;

-- Reload schema cache
SELECT pg_notify('pgrst', 'reload schema');
