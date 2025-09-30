-- Temporarily disable RLS and clean up all policies
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own client record" ON clients;
DROP POLICY IF EXISTS "Users can update own client record" ON clients;
DROP POLICY IF EXISTS "Users can insert own client record" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage all clients" ON clients;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create very simple policies without recursion
CREATE POLICY "user_profiles_select" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_profiles_update" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "clients_select" ON clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "clients_update" ON clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "clients_insert" ON clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);
