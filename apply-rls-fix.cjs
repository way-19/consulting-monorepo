const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyRLSFix() {
  console.log('Testing current RLS state...');
  
  try {
    // Test current RLS state
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .limit(1);
      
    console.log('Current RLS test (should fail for anon):', { 
      data: testData ? 'DATA FOUND - RLS NOT WORKING!' : null, 
      error: testError ? testError.message : 'No error - RLS not working!' 
    });
    
    if (testData && testData.length > 0) {
      console.log('🚨 CRITICAL SECURITY ISSUE: Anonymous users can access user_profiles!');
      console.log('This means RLS policies are not working correctly.');
      
      // Try to apply basic RLS fix
      console.log('\nAttempting to apply emergency RLS fix...');
      
      // We can't use service role key from client, so let's create a simple fix
      console.log('Please run the following SQL commands in Supabase SQL Editor:');
      console.log('');
      console.log('-- Emergency RLS Fix');
      console.log('REVOKE ALL ON user_profiles FROM anon;');
      console.log('REVOKE ALL ON user_profiles FROM public;');
      console.log('ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;');
      console.log('');
      console.log('-- Create basic policy for authenticated users only');
      console.log('DROP POLICY IF EXISTS "user_profiles_own_access" ON user_profiles;');
      console.log('CREATE POLICY "user_profiles_own_access" ON user_profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);');
      console.log('');
      console.log('-- Grant permissions only to authenticated users');
      console.log('GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;');
      
    } else {
      console.log('✅ RLS is working correctly - anonymous users cannot access user_profiles');
    }
    
  } catch (error) {
    console.error('Error testing RLS:', error);
  }
}

applyRLSFix();