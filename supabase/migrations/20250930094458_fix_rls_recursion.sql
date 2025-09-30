-- Fix infinite recursion in RLS policies
-- Drop problematic admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage all clients" ON clients;

-- Create simpler admin policies using auth.jwt() instead of recursive queries
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Admins can manage all profiles" ON user_profiles
    FOR ALL USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Admins can view all clients" ON clients
    FOR SELECT USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );

CREATE POLICY "Admins can manage all clients" ON clients
    FOR ALL USING (
        (auth.jwt() ->> 'role')::text = 'admin'
    );
