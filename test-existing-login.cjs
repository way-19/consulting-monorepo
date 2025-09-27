const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testExistingLogin() {
  try {
    console.log('Mevcut consultant ile giriş testi yapıyorum...');
    
    // Giorgi Meskhi ile giriş deneyelim
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'giorgi.meskhi@consulting19.com',
      password: 'consultant123'
    });
    
    if (error) {
      console.log('❌ Giriş başarısız:', error.message);
      
      // Farklı şifreler deneyelim
      console.log('\nFarklı şifreler deneniyor...');
      
      const passwords = ['123456', 'password', 'consultant', 'giorgi123', 'meskhi123'];
      
      for (const pwd of passwords) {
        console.log(`Şifre deneniyor: ${pwd}`);
        const { data: testData, error: testError } = await supabase.auth.signInWithPassword({
          email: 'giorgi.meskhi@consulting19.com',
          password: pwd
        });
        
        if (!testError) {
          console.log(`✅ Başarılı giriş! Şifre: ${pwd}`);
          console.log('User:', testData.user.email);
          return;
        }
      }
      
      console.log('❌ Hiçbir şifre çalışmadı');
    } else {
      console.log('✅ Giriş başarılı!');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('Email Confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

testExistingLogin();