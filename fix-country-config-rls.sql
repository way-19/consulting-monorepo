-- Fix RLS policies for country configurations
-- The issue is that admin policies reference auth.users table which anonymous users can't access

-- Drop the problematic admin policies that reference auth.users
DROP POLICY IF EXISTS "Admin full access to country configurations" ON country_configurations;
DROP POLICY IF EXISTS "Admin full access to form sections" ON country_form_sections;
DROP POLICY IF EXISTS "Admin full access to form fields" ON country_form_fields;
DROP POLICY IF EXISTS "Admin full access to packages" ON country_packages;
DROP POLICY IF EXISTS "Admin full access to services" ON country_services;
DROP POLICY IF EXISTS "Admin full access to audit log" ON country_config_audit;

-- Create new admin policies that use user_profiles instead of auth.users
CREATE POLICY "Admin full access to country configurations" ON country_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access to form sections" ON country_form_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access to form fields" ON country_form_fields
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access to packages" ON country_packages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access to services" ON country_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin full access to audit log" ON country_config_audit
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );