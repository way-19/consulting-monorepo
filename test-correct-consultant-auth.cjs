const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔐 Testing Consultant Authentication with Correct Password');
console.log('=====================================================');

async function testConsultantAuth() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📧 Email: giorgi.meskhi@consulting19.com');
    console.log('🔑 Password: Consultant123!');
    console.log('');
    
    // Test authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'giorgi.meskhi@consulting19.com',
      password: 'Consultant123!'
    });
    
    if (error) {
      console.log('❌ Authentication failed:', error.message);
      return;
    }
    
    if (data.user) {
      console.log('✅ Authentication successful!');
      console.log('👤 User ID:', data.user.id);
      console.log('📧 Email:', data.user.email);
      console.log('🔐 Session:', data.session ? 'Active' : 'None');
      
      // Test profile fetch
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.log('⚠️  Profile fetch error:', profileError.message);
      } else {
        console.log('👤 Profile found:', profile.name || 'No name');
        console.log('🏢 Role:', profile.role || 'No role');
      }
      
      // Sign out
      await supabase.auth.signOut();
      console.log('🚪 Signed out successfully');
      
    } else {
      console.log('❌ No user data returned');
    }
    
  } catch (err) {
    console.error('💥 Test failed:', err.message);
  }
}

testConsultantAuth();