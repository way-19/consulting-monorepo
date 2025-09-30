-- Fix consultant_profiles references to user_profiles
-- This migration updates all foreign key constraints to reference the renamed table

-- Drop existing foreign key constraints that reference consultant_profiles
ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_consultant_id_fkey;
ALTER TABLE consultant_countries DROP CONSTRAINT IF EXISTS consultant_countries_consultant_id_fkey;
ALTER TABLE consultant_spoken_languages DROP CONSTRAINT IF EXISTS consultant_spoken_languages_consultant_id_fkey;
ALTER TABLE consultant_country_services DROP CONSTRAINT IF EXISTS consultant_country_services_consultant_id_fkey;
ALTER TABLE service_purchases DROP CONSTRAINT IF EXISTS service_purchases_consultant_id_fkey;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_consultant_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_consultant_id_fkey;

-- Add new foreign key constraints that reference user_profiles
ALTER TABLE service_orders ADD CONSTRAINT service_orders_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_countries ADD CONSTRAINT consultant_countries_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_spoken_languages ADD CONSTRAINT consultant_spoken_languages_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE consultant_country_services ADD CONSTRAINT consultant_country_services_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE service_purchases ADD CONSTRAINT service_purchases_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE projects ADD CONSTRAINT projects_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE tasks ADD CONSTRAINT tasks_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Add a comment to document the change
COMMENT ON CONSTRAINT service_orders_consultant_id_fkey ON service_orders IS 'Updated to reference user_profiles instead of consultant_profiles';
