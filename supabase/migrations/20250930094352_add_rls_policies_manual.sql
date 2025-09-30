-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Create basic RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin policies
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own client record" ON clients;
DROP POLICY IF EXISTS "Users can update own client record" ON clients;
DROP POLICY IF EXISTS "Users can insert own client record" ON clients;
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage all clients" ON clients;

-- Create basic RLS policies for clients
CREATE POLICY "Users can view own client record" ON clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own client record" ON clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client record" ON clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies for clients
CREATE POLICY "Admins can view all clients" ON clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );
