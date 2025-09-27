const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function testConsultantLogin() {
  console.log('🔐 Testing Consultant Login with Frontend Default Password');
  console.log('========================================================\n');

  try {
    // Test with the password that's set as default in the frontend
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'giorgi.meskhi@consulting19.com',
      password: 'Consultant123!' // This is the default password in the frontend
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('Error details:', error);
      
      // Try with lowercase version as well
      console.log('\n🔄 Trying with lowercase password...');
      const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
        email: 'giorgi.meskhi@consulting19.com',
        password: 'consultant123'
      });
      
      if (error2) {
        console.error('❌ Lowercase login also failed:', error2.message);
      } else {
        console.log('✅ Login successful with lowercase password!');
        console.log('User ID:', data2.user?.id);
        console.log('Email confirmed:', data2.user?.email_confirmed_at ? 'Yes' : 'No');
      }
    } else {
      console.log('✅ Login successful with frontend default password!');
      console.log('User ID:', data.user?.id);
      console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConsultantLogin();