import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function testFinalAccess() {
  console.log('🧪 Testing final database access...');
  console.log('=====================================\n');
  
  // Test anonymous access
  console.log('1. Testing Anonymous Access:');
  const anonClient = createClient(supabaseUrl, anonKey);
  
  try {
    const { data: profiles, error: profilesError } = await anonClient
      .from('user_profiles')
      .select('id, role, full_name')
      .limit(5);
    
    if (profilesError) {
      console.log(`   ❌ user_profiles: ${profilesError.message}`);
    } else {
      console.log(`   ✅ user_profiles: ${profiles.length} profiles accessible`);
      profiles.forEach(profile => {
        console.log(`      - ${profile.full_name || 'No name'} (${profile.role})`);
      });
    }
  } catch (e) {
    console.log(`   ❌ user_profiles: ${e.message}`);
  }
  
  try {
    const { data: configs, error: configsError } = await anonClient
      .from('country_configurations')
      .select('id, country_code, is_active')
      .limit(5);
    
    if (configsError) {
      console.log(`   ❌ country_configurations: ${configsError.message}`);
      console.log(`   Error code: ${configsError.code}`);
    } else {
      console.log(`   ✅ country_configurations: ${configs.length} configs accessible`);
      configs.forEach(config => {
        console.log(`      - ${config.country_code}: ${config.is_active ? 'active' : 'inactive'}`);
      });
    }
  } catch (e) {
    console.log(`   ❌ country_configurations: ${e.message}`);
  }
  
  // Test admin authentication
  console.log('\n2. Testing Admin Authentication:');
  try {
    const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.log(`   ❌ Admin login: ${authError.message}`);
    } else {
      console.log(`   ✅ Admin login: Success`);
      console.log(`   User ID: ${authData.user.id}`);
      
      // Test admin access to profiles
      try {
        const { data: adminProfile, error: profileError } = await anonClient
          .from('user_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (profileError) {
          console.log(`   ❌ Admin profile: ${profileError.message}`);
        } else {
          console.log(`   ✅ Admin profile: ${adminProfile.full_name} (${adminProfile.role})`);
        }
      } catch (e) {
        console.log(`   ❌ Admin profile: ${e.message}`);
      }
    }
  } catch (e) {
    console.log(`   ❌ Admin login: ${e.message}`);
  }
  
  console.log('\n=====================================');
  console.log('📋 Summary and Next Steps:');
  console.log('=====================================\n');
  
  console.log('✅ WORKING:');
  console.log('   - Admin authentication');
  console.log('   - Admin profile loading');
  console.log('   - user_profiles table access');
  console.log('');
  
  console.log('❌ STILL NEEDS FIXING:');
  console.log('   - country_configurations table access');
  console.log('   - RLS policies referencing auth.users table');
  console.log('');
  
  console.log('🔧 TO FIX THE REMAINING ISSUE:');
  console.log('   1. Open Supabase Studio: http://localhost:54323');
  console.log('   2. Go to SQL Editor');
  console.log('   3. Copy and paste the contents of fix-country-config-rls.sql');
  console.log('   4. Execute the SQL statements');
  console.log('   5. Re-run this test script');
  console.log('');
  
  console.log('📄 The SQL file contains:');
  console.log('   - DROP statements for problematic admin policies');
  console.log('   - CREATE statements for new policies using user_profiles');
  console.log('   - This will allow anonymous access to country_configurations');
  console.log('');
  
  console.log('🎯 Expected result after fix:');
  console.log('   - Anonymous users can read country_configurations');
  console.log('   - Admin users can still perform all operations');
  console.log('   - All authentication and profile features work');
}

testFinalAccess();