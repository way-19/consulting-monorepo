-- Comprehensive RLS Fix Script
-- This script completely disables RLS and grants full access to all roles

-- First, check current RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Disable RLS for all critical tables
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.country_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.country_form_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.country_form_fields DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.country_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.country_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.consultant_country_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.project_tasks DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to ensure clean slate
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Grant ALL privileges to ALL roles on ALL tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('GRANT ALL ON public.%I TO anon', r.tablename);
        EXECUTE format('GRANT ALL ON public.%I TO authenticated', r.tablename);
        EXECUTE format('GRANT ALL ON public.%I TO service_role', r.tablename);
        EXECUTE format('GRANT ALL ON public.%I TO postgres', r.tablename);
    END LOOP;
END $$;

-- Grant sequence permissions
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT sequencename 
        FROM pg_sequences 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('GRANT ALL ON SEQUENCE public.%I TO anon', r.sequencename);
        EXECUTE format('GRANT ALL ON SEQUENCE public.%I TO authenticated', r.sequencename);
        EXECUTE format('GRANT ALL ON SEQUENCE public.%I TO service_role', r.sequencename);
        EXECUTE format('GRANT ALL ON SEQUENCE public.%I TO postgres', r.sequencename);
    END LOOP;
END $$;

-- Final verification - check RLS status after changes
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    CASE WHEN rowsecurity THEN '❌ STILL ENABLED' ELSE '✅ DISABLED' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Test access with a simple query
SELECT 'RLS Fix completed successfully!' as message;