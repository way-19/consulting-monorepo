import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSStatus() {
  console.log('🔍 Checking RLS status and policies...');
  
  try {
    // Check if RLS is enabled on user_profiles table
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            schemaname,
            tablename,
            rowsecurity as rls_enabled,
            hasrls
          FROM pg_tables 
          WHERE tablename = 'user_profiles';
        `
      });
    
    if (rlsError) {
      console.log('❌ Error checking RLS status:', rlsError);
    } else {
      console.log('🔒 RLS Status:', rlsStatus);
    }

    // Check existing policies using direct SQL
    const { data: policies, error: policiesError } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
          FROM pg_policies 
          WHERE tablename = 'user_profiles';
        `
      });
    
    if (policiesError) {
      console.log('❌ Error getting policies:', policiesError);
    } else {
      console.log('📋 Current RLS policies for user_profiles:');
      if (policies && policies.length > 0) {
        policies.forEach(policy => {
          console.log(`  - ${policy.policyname}: ${policy.cmd} for roles: ${policy.roles}`);
          console.log(`    Condition: ${policy.qual}`);
        });
      } else {
        console.log('  No policies found!');
      }
    }

    // Test with anon key (what the frontend uses)
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNx_kzKJx9B4gLNHzM5uTMzAqVG8';
    const anonClient = createClient(supabaseUrl, anonKey);
    
    console.log('\n🔍 Testing with anon client (frontend simulation)...');
    
    // Try to query user_profiles with anon client
    const { data: anonProfiles, error: anonError } = await anonClient
      .from('user_profiles')
      .select('*');
    
    if (anonError) {
      console.log('❌ Anon client error:', anonError);
    } else {
      console.log('✅ Anon client success:', anonProfiles?.length || 0, 'profiles');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkRLSStatus();