import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSPolicies() {
  console.log('🔍 Checking RLS policies for user_profiles table...');
  
  try {
    // Check if RLS is enabled on user_profiles table
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('pg_get_tabledef', { table_name: 'user_profiles' })
      .single();
    
    if (tableError) {
      console.log('❌ Error getting table info:', tableError);
    } else {
      console.log('📋 Table info:', tableInfo);
    }

    // Check existing policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'user_profiles');
    
    if (policiesError) {
      console.log('❌ Error getting policies:', policiesError);
    } else {
      console.log('🔒 Current RLS policies for user_profiles:');
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} - ${policy.qual}`);
      });
    }

    // Try to query user_profiles directly with service role
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.log('❌ Error querying user_profiles:', profilesError);
    } else {
      console.log('👥 User profiles found:', profiles.length);
      profiles.forEach(profile => {
        console.log(`  - ${profile.id}: ${profile.email} (${profile.role})`);
      });
    }

    // Check auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error getting auth users:', authError);
    } else {
      console.log('🔐 Auth users found:', authUsers.users.length);
      authUsers.users.forEach(user => {
        console.log(`  - ${user.id}: ${user.email} (${user.user_metadata?.role || 'no role'})`);
      });
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkRLSPolicies();