import { createClient } from '@supabase/supabase-js';

// Test the exact same configuration as the frontend
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('🧪 Testing Frontend Authentication Configuration');
console.log('===============================================\n');

console.log('Configuration:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key: ${supabaseAnonKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

async function testFrontendAuth() {
  try {
    console.log('\n1. Testing Supabase Connection...');
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.log(`   ❌ Connection test failed: ${healthError.message}`);
    } else {
      console.log(`   ✅ Connection successful`);
    }
    
    console.log('\n2. Testing Admin Login...');
    
    // Test admin login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.log(`   ❌ Login failed: ${authError.message}`);
      console.log(`   Error code: ${authError.status || 'No status'}`);
      console.log(`   Full error:`, authError);
      
      // Check if it's a network issue
      if (authError.message.includes('fetch')) {
        console.log('\n🔍 This appears to be a network/connection issue.');
        console.log('   Possible causes:');
        console.log('   - Supabase local server not running');
        console.log('   - Wrong URL or port');
        console.log('   - CORS issues');
      }
    } else {
      console.log(`   ✅ Login successful!`);
      console.log(`   User ID: ${authData.user.id}`);
      console.log(`   Email: ${authData.user.email}`);
      
      // Test profile fetch
      console.log('\n3. Testing Profile Fetch...');
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        console.log(`   ❌ Profile fetch failed: ${profileError.message}`);
      } else {
        console.log(`   ✅ Profile loaded: ${profile.full_name} (${profile.role})`);
      }
      
      // Sign out
      await supabase.auth.signOut();
      console.log('   ✅ Signed out successfully');
    }
    
    console.log('\n4. Testing Different Credentials...');
    
    // Test with different password variations
    const testCredentials = [
      { email: 'admin@consulting19.com', password: 'Admin123!' },
      { email: 'admin@consulting19.com', password: 'admin123' },
      { email: 'giorgi.meskhi@consulting19.com', password: 'consultant123' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`\n   Testing ${cred.email} with password ${cred.password}...`);
      
      const { data, error } = await supabase.auth.signInWithPassword(cred);
      
      if (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      } else {
        console.log(`   ✅ Success: ${data.user.email}`);
        await supabase.auth.signOut();
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testFrontendAuth();