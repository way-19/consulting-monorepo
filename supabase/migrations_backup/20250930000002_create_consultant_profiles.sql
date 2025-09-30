-- Create consultant_profiles table
-- This migration creates a dedicated table for consultant profile information

-- Create consultant_profiles table
CREATE TABLE consultant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(255),
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2) DEFAULT 0.00,
  bio TEXT,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE consultant_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Consultants can view their own profile" ON consultant_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Consultants can update their own profile" ON consultant_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Consultants can insert their own profile" ON consultant_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consultant profiles" ON consultant_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view consultant profiles" ON consultant_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'client'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultant_profiles_user_id ON consultant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_consultant_profiles_availability ON consultant_profiles(availability_status);

-- Insert profiles for existing consultant users
INSERT INTO consultant_profiles (user_id, first_name, last_name, email, specialization, experience_years, hourly_rate, bio)
SELECT 
  up.user_id,
  up.first_name,
  up.last_name,
  up.email,
  'General Consulting' as specialization,
  5 as experience_years,
  100.00 as hourly_rate,
  'Experienced consultant ready to help with your business needs.' as bio
FROM user_profiles up
WHERE up.role = 'consultant'
AND NOT EXISTS (
  SELECT 1 FROM consultant_profiles cp WHERE cp.user_id = up.user_id
);

-- Add comments
COMMENT ON TABLE consultant_profiles IS 'Stores detailed profile information for consultant users';
COMMENT ON COLUMN consultant_profiles.user_id IS 'References the auth.users table';
COMMENT ON COLUMN consultant_profiles.specialization IS 'Consultant area of expertise';
COMMENT ON COLUMN consultant_profiles.experience_years IS 'Years of professional experience';
COMMENT ON COLUMN consultant_profiles.hourly_rate IS 'Hourly consulting rate in USD';
COMMENT ON COLUMN consultant_profiles.availability_status IS 'Current availability status (available, busy, offline)';