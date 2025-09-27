const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// .env dosyasını manuel oku
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const anonKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function testAdminAuth() {
  try {
    console.log('🔐 Admin giriş bilgilerini test ediyorum...');
    console.log('📧 Email: admin@consulting19.com');
    console.log('🔑 Password: admin123');
    
    // Admin ile giriş yapmayı dene
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Giriş başarısız:', error.message);
      console.log('🔍 Hata detayları:', error);
      
      // Şifre sıfırlama öner
      console.log('\n💡 Çözüm önerileri:');
      console.log('1. Şifre yanlış olabilir');
      console.log('2. Kullanıcı auth tablosunda olmayabilir');
      console.log('3. Email doğrulanmamış olabilir');
      
      return;
    }
    
    if (data.user) {
      console.log('✅ Giriş başarılı!');
      console.log('👤 Kullanıcı ID:', data.user.id);
      console.log('📧 Email:', data.user.email);
      console.log('✅ Email doğrulandı:', data.user.email_confirmed_at ? 'EVET' : 'HAYIR');
      console.log('🎭 Metadata:', data.user.user_metadata);
      
      // Kullanıcı profilini kontrol et
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.log('⚠️ Profil alınamadı:', profileError.message);
      } else {
        console.log('👥 Profil bulundu:');
        console.log('  - İsim:', profile.full_name);
        console.log('  - Rol:', profile.role);
        console.log('  - Aktif:', profile.is_active);
      }
      
      // Çıkış yap
      await supabase.auth.signOut();
      console.log('🚪 Çıkış yapıldı');
    }
    
  } catch (error) {
    console.error('❌ Test hatası:', error);
  }
}

testAdminAuth();