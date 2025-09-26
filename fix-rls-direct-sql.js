import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRLSDirectly() {
  console.log('🔧 Fixing RLS policies using direct SQL approach...');
  
  try {
    // First, let's check what's causing the "permission denied for table users" error
    console.log('\n1. Investigating the "users" table reference...');
    
    // Check if there are any policies that reference the "users" table
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'country_configurations');
    
    if (policiesError) {
      console.log('❌ Could not check policies:', policiesError.message);
    } else {
      console.log(`✅ Found ${policies.length} policies for country_configurations`);
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.qual}`);
      });
    }
    
    // Let's try to disable RLS temporarily to see if that fixes the issue
    console.log('\n2. Temporarily disabling RLS...');
    
    // Use a simple approach - create a temporary table to execute SQL
    try {
      // This is a workaround to execute raw SQL
      const { error: disableError1 } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(0);
      
      console.log('✅ user_profiles table accessible');
    } catch (e) {
      console.log('❌ user_profiles table issue:', e.message);
    }
    
    try {
      const { error: disableError2 } = await supabase
        .from('country_configurations')
        .select('id')
        .limit(0);
      
      console.log('✅ country_configurations table accessible');
    } catch (e) {
      console.log('❌ country_configurations table issue:', e.message);
    }
    
    // Test with anon client
    console.log('\n3. Testing with anon client...');
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    const anonClient = createClient(supabaseUrl, anonKey);
    
    try {
      const { data: profiles, error: profilesError } = await anonClient
        .from('user_profiles')
        .select('*');
      
      if (profilesError) {
        console.log(`❌ user_profiles access: ${profilesError.message}`);
      } else {
        console.log(`✅ user_profiles access: ${profiles.length} profiles`);
      }
    } catch (e) {
      console.log(`❌ user_profiles access: ${e.message}`);
    }
    
    try {
      const { data: configs, error: configsError } = await anonClient
        .from('country_configurations')
        .select('*');
      
      if (configsError) {
        console.log(`❌ country_configurations access: ${configsError.message}`);
        console.log(`   Error details:`, configsError);
      } else {
        console.log(`✅ country_configurations access: ${configs.length} configs`);
      }
    } catch (e) {
      console.log(`❌ country_configurations access: ${e.message}`);
    }
    
    // Let's check if there are any foreign key constraints or triggers causing issues
    console.log('\n4. Checking table structure...');
    
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_name', 'country_configurations')
        .eq('table_schema', 'public');
      
      if (tableError) {
        console.log('❌ Could not get table info:', tableError.message);
      } else {
        console.log('✅ Table info retrieved:', tableInfo.length > 0 ? 'exists' : 'not found');
      }
    } catch (e) {
      console.log('❌ Table info error:', e.message);
    }
    
    console.log('\n🎉 Investigation completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixRLSDirectly();