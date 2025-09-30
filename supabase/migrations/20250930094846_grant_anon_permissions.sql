-- Grant explicit permissions to anon role
GRANT SELECT, INSERT, UPDATE ON user_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON clients TO anon;
GRANT SELECT, INSERT, UPDATE ON consultant_profiles TO anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant permissions on auth schema if needed
GRANT USAGE ON SCHEMA auth TO anon;
