-- Fix RLS policies for country_configurations table
-- This migration ensures anonymous users can read country configurations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "country_configurations_select_policy" ON country_configurations;

-- Create new policy for public read access
CREATE POLICY "country_configurations_select_policy" 
ON country_configurations 
FOR SELECT 
TO public 
USING (true);

-- Ensure RLS is enabled
ALTER TABLE country_configurations ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON country_configurations TO anon;
GRANT SELECT ON country_configurations TO authenticated;