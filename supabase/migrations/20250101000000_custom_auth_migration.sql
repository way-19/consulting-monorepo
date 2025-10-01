-- Custom JWT Authentication Migration
-- This migration adds support for custom JWT authentication

-- Create users table for custom auth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'consultant', 'admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  business_type VARCHAR(100),
  country VARCHAR(100),
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  billing_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing tables to reference new users table
-- Note: This assumes you want to migrate from Supabase auth to custom auth

-- Add user_id column to existing tables if they don't exist
DO $$ 
BEGIN
  -- Add user_id to service_orders if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'service_orders' AND column_name = 'user_id') THEN
    ALTER TABLE service_orders ADD COLUMN user_id UUID REFERENCES users(id);
  END IF;

  -- Add user_id to projects if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'projects' AND column_name = 'client_user_id') THEN
    ALTER TABLE projects ADD COLUMN client_user_id UUID REFERENCES users(id);
  END IF;

  -- Add user_id to tasks if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'tasks' AND column_name = 'assigned_user_id') THEN
    ALTER TABLE tasks ADD COLUMN assigned_user_id UUID REFERENCES users(id);
  END IF;

  -- Add user_id to messages if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'messages' AND column_name = 'sender_user_id') THEN
    ALTER TABLE messages ADD COLUMN sender_user_id UUID REFERENCES users(id);
    ALTER TABLE messages ADD COLUMN receiver_user_id UUID REFERENCES users(id);
  END IF;

  -- Add user_id to documents if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'documents' AND column_name = 'uploaded_by_user_id') THEN
    ALTER TABLE documents ADD COLUMN uploaded_by_user_id UUID REFERENCES users(id);
  END IF;

  -- Add user_id to virtual_mail_items if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'virtual_mail_items' AND column_name = 'recipient_user_id') THEN
    ALTER TABLE virtual_mail_items ADD COLUMN recipient_user_id UUID REFERENCES users(id);
  END IF;
END $$;

-- Create RLS policies for custom auth
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.jwt() ->> 'userId' = id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.jwt() ->> 'userId' = id::text);

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.jwt() ->> 'userId' = user_id::text);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'userId' = user_id::text);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'userId' = user_id::text);

-- Password reset tokens policies
CREATE POLICY "Users can view their own reset tokens" ON password_reset_tokens
  FOR SELECT USING (auth.jwt() ->> 'userId' = user_id::text);

-- Update existing table policies to use custom auth
-- Service orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON service_orders;
CREATE POLICY "Users can view their own orders" ON service_orders
  FOR SELECT USING (
    auth.jwt() ->> 'userId' = user_id::text OR
    auth.jwt() ->> 'userId' = consultant_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );

-- Projects policies
DROP POLICY IF EXISTS "Users can view their projects" ON projects;
CREATE POLICY "Users can view their projects" ON projects
  FOR SELECT USING (
    auth.jwt() ->> 'userId' = client_user_id::text OR
    auth.jwt() ->> 'userId' = consultant_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );

-- Tasks policies
DROP POLICY IF EXISTS "Users can view their tasks" ON tasks;
CREATE POLICY "Users can view their tasks" ON tasks
  FOR SELECT USING (
    auth.jwt() ->> 'userId' = assigned_user_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Consultants can update their tasks" ON tasks
  FOR UPDATE USING (
    auth.jwt() ->> 'userId' = assigned_user_id::text AND
    auth.jwt() ->> 'role' = 'consultant'
  );

-- Messages policies
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    auth.jwt() ->> 'userId' = sender_user_id::text OR
    auth.jwt() ->> 'userId' = receiver_user_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.jwt() ->> 'userId' = sender_user_id::text);

-- Documents policies
DROP POLICY IF EXISTS "Users can view their documents" ON documents;
CREATE POLICY "Users can view their documents" ON documents
  FOR SELECT USING (
    auth.jwt() ->> 'userId' = uploaded_by_user_id::text OR
    auth.jwt() ->> 'userId' = client_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT WITH CHECK (auth.jwt() ->> 'userId' = uploaded_by_user_id::text);

-- Virtual mail policies
DROP POLICY IF EXISTS "Users can view their mail" ON virtual_mail_items;
CREATE POLICY "Users can view their mail" ON virtual_mail_items
  FOR SELECT USING (
    auth.jwt() ->> 'userId' = recipient_user_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );

-- Create function to get current user from JWT
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb
LANGUAGE sql STABLE
AS $$
  SELECT 
    COALESCE(
      current_setting('request.jwt.claims', true)::jsonb,
      '{}'::jsonb
    );
$$;

-- Create function to get current user ID
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT (auth.jwt() ->> 'userId')::uuid;
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT auth.jwt() ->> 'role';
$$;

-- Insert default admin user (password: admin123456)
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  is_active, 
  email_verified
) VALUES (
  'admin@consulting19.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlJO', -- bcrypt hash of 'admin123456'
  'Admin',
  'User',
  'admin',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
INSERT INTO user_profiles (
  user_id,
  company_name,
  country,
  language
) SELECT 
  id,
  'Consulting19 Admin',
  'Turkey',
  'en'
FROM users 
WHERE email = 'admin@consulting19.com'
ON CONFLICT (user_id) DO NOTHING;