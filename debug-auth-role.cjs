const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function debugAuthRole() {
  console.log('🔍 Debugging authentication and role verification...\n');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // 1. Test login
    console.log('1️⃣ Testing login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'giorgi.meskhi@consulting19.com',
      password: 'Consultant123!'
    });

    if (authError) {
      console.log('❌ Login failed:', authError.message);
      return;
    }

    console.log('✅ Login successful');
    console.log('   User ID:', authData.user.id);
    console.log('   Email:', authData.user.email);
    console.log('   Email confirmed:', authData.user.email_confirmed_at ? 'Yes' : 'No');

    // 2. Get current session
    console.log('\n2️⃣ Getting current session...');
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      console.log('✅ Session exists');
      console.log('   Access token exists:', !!session.session.access_token);
      console.log('   User ID from session:', session.session.user.id);
    } else {
      console.log('❌ No session found');
    }

    // 3. Get user profile
    console.log('\n3️⃣ Getting user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.log('❌ Profile fetch failed:', profileError.message);
    } else {
      console.log('✅ Profile found');
      console.log('   Profile ID:', profile.id);
      console.log('   Email:', profile.email);
      console.log('   Role:', profile.role);
      console.log('   Full name:', profile.full_name);
      console.log('   Active:', profile.is_active);
    }

    // 4. Test RLS policies
    console.log('\n4️⃣ Testing RLS policies...');
    const { data: profilesRLS, error: rlsError } = await supabase
      .from('user_profiles')
      .select('id, email, role, full_name')
      .eq('email', 'giorgi.meskhi@consulting19.com');

    if (rlsError) {
      console.log('❌ RLS test failed:', rlsError.message);
    } else {
      console.log('✅ RLS test passed');
      console.log('   Profiles accessible:', profilesRLS.length);
      if (profilesRLS.length > 0) {
        console.log('   Role from RLS query:', profilesRLS[0].role);
      }
    }

    // 5. Test JWT claims
    console.log('\n5️⃣ Checking JWT claims...');
    if (session.session) {
      try {
        const payload = JSON.parse(atob(session.session.access_token.split('.')[1]));
        console.log('✅ JWT payload decoded');
        console.log('   User metadata:', payload.user_metadata || 'None');
        console.log('   App metadata:', payload.app_metadata || 'None');
        console.log('   Role claim:', payload.role || 'None');
        console.log('   Email:', payload.email);
      } catch (e) {
        console.log('❌ Failed to decode JWT:', e.message);
      }
    }

    // 6. Sign out
    console.log('\n6️⃣ Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

debugAuthRole();