import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const correctAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function testAnonAccess() {
  console.log('🧪 Testing anon client access with correct key...');
  
  const anonClient = createClient(supabaseUrl, correctAnonKey);
  
  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError) {
      console.log('❌ Auth getUser error:', userError);
    } else {
      console.log('✅ Auth getUser success (no user expected)');
    }

    // Test user_profiles access
    console.log('2. Testing user_profiles access...');
    const { data: profiles, error: profilesError } = await anonClient
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ user_profiles error:', profilesError);
    } else {
      console.log('✅ user_profiles access working!', profiles?.length || 0, 'profiles');
    }

    // Test country_configurations access
    console.log('3. Testing country_configurations access...');
    const { data: configs, error: configsError } = await anonClient
      .from('country_configurations')
      .select('*')
      .limit(1);
    
    if (configsError) {
      console.log('❌ country_configurations error:', configsError);
    } else {
      console.log('✅ country_configurations access working!', configs?.length || 0, 'configs');
    }

    // Test auth with admin credentials
    console.log('4. Testing admin login...');
    const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.log('❌ Admin login error:', authError);
    } else {
      console.log('✅ Admin login success!', authData.user?.email);
      
      // Test profile access after login
      const { data: userProfile, error: userProfileError } = await anonClient
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (userProfileError) {
        console.log('❌ User profile after login error:', userProfileError);
      } else {
        console.log('✅ User profile after login success:', userProfile?.role);
      }
      
      // Sign out
      await anonClient.auth.signOut();
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testAnonAccess();