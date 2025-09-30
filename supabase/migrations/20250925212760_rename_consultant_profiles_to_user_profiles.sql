-- Migration to rename consultant_profiles to user_profiles
-- This aligns the database schema with the application code expectations

-- First, rename the table
ALTER TABLE consultant_profiles RENAME TO user_profiles;

-- Add additional columns that are expected by the application
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'consultant',
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 65.00;

-- Update foreign key constraint names to reflect the new table name
-- Note: PostgreSQL automatically updates constraint names when renaming tables,
-- but we'll ensure consistency

-- Update any indexes that reference the old table name
-- (PostgreSQL handles this automatically, but we document it for clarity)

-- Create an index on the role column for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Update any views or functions that might reference the old table name
-- (None found in current schema, but this is where they would be updated)

-- Note: PostgreSQL automatically updates foreign key references when a table is renamed,
-- so all existing foreign key constraints will continue to work correctly.

-- Add a comment to document the change
COMMENT ON TABLE user_profiles IS 'Unified user profiles table for all user types (consultants, clients, admins). Renamed from consultant_profiles to align with application code.';
