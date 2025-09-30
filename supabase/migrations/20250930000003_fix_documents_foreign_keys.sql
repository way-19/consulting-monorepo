-- Fix documents table foreign key constraints
-- This migration fixes the uploaded_by foreign key to reference user_profiles.user_id

-- First, ensure user_profiles.user_id has a unique constraint
DO $$ 
BEGIN
    -- Check if unique constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_profiles' 
        AND constraint_type = 'UNIQUE' 
        AND constraint_name = 'user_profiles_user_id_key'
    ) THEN
        -- Add unique constraint to user_profiles.user_id
        ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Drop existing foreign key constraint if it exists
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_uploaded_by_fkey;

-- Add correct foreign key constraint
ALTER TABLE documents ADD CONSTRAINT documents_uploaded_by_fkey 
  FOREIGN KEY (uploaded_by) REFERENCES user_profiles(user_id);

-- Add comment
COMMENT ON CONSTRAINT documents_uploaded_by_fkey ON documents IS 'References user_profiles.user_id for the user who uploaded the document';
