import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.M7uQCiPyI6c6ROx-K7_LdmSqQY5F-kEHqcFVw7f4WBc'
);

async function testConsultantLogin() {
  try {
    console.log('🔐 Testing consultant login...\n');

    // Test login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'giorgi.meskhi@consulting19.com',
      password: 'Consultant123!'
    });

    if (authError) {
      console.error('❌ Login failed:', authError.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('User ID:', authData.user.id);
    console.log('Email:', authData.user.email);
    console.log('User metadata:', authData.user.user_metadata);

    // Check user profile in database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
    } else {
      console.log('\n📋 User Profile:');
      console.log('ID:', profile.id);
      console.log('Email:', profile.email);
      console.log('Full Name:', profile.full_name);
      console.log('Role:', profile.role);
      console.log('Created:', profile.created_at);
    }

    // Check session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('\n🔑 Current Session:');
    console.log('Session exists:', !!sessionData.session);
    console.log('User role from metadata:', sessionData.session?.user?.user_metadata?.role);

    // Logout
    console.log('\n🚪 Logging out...');
    await supabase.auth.signOut();
    console.log('✅ Logout successful!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConsultantLogin();