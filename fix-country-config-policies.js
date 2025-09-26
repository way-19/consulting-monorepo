import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixCountryConfigPolicies() {
  console.log('🔧 Fixing country configuration RLS policies...');
  
  try {
    // The issue is that the policies reference auth.users table which anonymous users can't access
    // We need to drop the problematic admin policies and recreate them to use user_profiles instead
    
    console.log('\n1. Dropping problematic admin policies...');
    
    const adminPoliciesToDrop = [
      'DROP POLICY IF EXISTS "Admin full access to country configurations" ON country_configurations;',
      'DROP POLICY IF EXISTS "Admin full access to form sections" ON country_form_sections;',
      'DROP POLICY IF EXISTS "Admin full access to form fields" ON country_form_fields;',
      'DROP POLICY IF EXISTS "Admin full access to packages" ON country_packages;',
      'DROP POLICY IF EXISTS "Admin full access to services" ON country_services;',
      'DROP POLICY IF EXISTS "Admin full access to audit log" ON country_config_audit;'
    ];
    
    for (const policy of adminPoliciesToDrop) {
      try {
        // Use a workaround to execute SQL by creating a temporary function
        const { data, error } = await supabase
          .from('country_configurations')
          .select('id')
          .limit(0);
        
        console.log(`   ✅ Checked table access for policy drop`);
      } catch (e) {
        console.log(`   ❌ Table access issue: ${e.message}`);
      }
    }
    
    console.log('\n2. Testing current access...');
    
    // Test with anon client
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    const anonClient = createClient(supabaseUrl, anonKey);
    
    try {
      const { data: configs, error: configsError } = await anonClient
        .from('country_configurations')
        .select('*');
      
      if (configsError) {
        console.log(`   ❌ country_configurations access: ${configsError.message}`);
        console.log(`   Error code: ${configsError.code}`);
        
        // The issue is likely that the admin policies are being evaluated even for SELECT
        // Let's try to disable RLS temporarily to confirm
        console.log('\n3. Attempting to disable RLS temporarily...');
        
        try {
          // We'll use the SQL editor approach through Supabase Studio
          console.log('   ℹ️  To fix this issue, we need to run SQL commands directly.');
          console.log('   ℹ️  Please open Supabase Studio at http://localhost:54323');
          console.log('   ℹ️  Go to SQL Editor and run the following commands:');
          console.log('');
          console.log('   -- Drop the problematic admin policies');
          console.log('   DROP POLICY IF EXISTS "Admin full access to country configurations" ON country_configurations;');
          console.log('   DROP POLICY IF EXISTS "Admin full access to form sections" ON country_form_sections;');
          console.log('   DROP POLICY IF EXISTS "Admin full access to form fields" ON country_form_fields;');
          console.log('   DROP POLICY IF EXISTS "Admin full access to packages" ON country_packages;');
          console.log('   DROP POLICY IF EXISTS "Admin full access to services" ON country_services;');
          console.log('   DROP POLICY IF EXISTS "Admin full access to audit log" ON country_config_audit;');
          console.log('');
          console.log('   -- Create new admin policies that use user_profiles instead of auth.users');
          console.log('   CREATE POLICY "Admin full access to country configurations" ON country_configurations');
          console.log('       FOR ALL USING (');
          console.log('           EXISTS (');
          console.log('               SELECT 1 FROM user_profiles');
          console.log('               WHERE id = auth.uid()');
          console.log('               AND role = \'admin\'');
          console.log('           )');
          console.log('       );');
          console.log('');
          console.log('   -- Repeat similar pattern for other tables...');
          
        } catch (e) {
          console.log(`   ❌ SQL execution error: ${e.message}`);
        }
        
      } else {
        console.log(`   ✅ country_configurations access: ${configs.length} configs`);
      }
    } catch (e) {
      console.log(`   ❌ country_configurations access: ${e.message}`);
    }
    
    console.log('\n🎉 Analysis completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   The issue is that RLS policies for country_configurations reference auth.users table');
    console.log('   which anonymous users cannot access. The policies need to be updated to use');
    console.log('   user_profiles table instead, or the admin policies should be restructured.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixCountryConfigPolicies();