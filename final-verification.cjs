const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function finalVerification() {
  console.log('✅ Son Doğrulama - Danışman Giriş Testi');
  console.log('=====================================\n');

  try {
    const consultantEmail = 'giorgi.meskhi@consulting19.com';
    const consultantPassword = 'consultant123';

    // 1. Profil kontrolü
    console.log('👤 Profil kontrolü yapılıyor...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', consultantEmail)
      .single();

    if (profileError) {
      console.error('❌ Profil bulunamadı:', profileError);
      return;
    }

    console.log('✅ Profil bulundu:');
    console.log('  Ad:', profile.full_name);
    console.log('  Email:', profile.email);
    console.log('  Rol:', profile.role);
    console.log('  Şirket:', profile.company);
    console.log('  Aktif:', profile.is_active);

    // 2. Giriş testi
    console.log('\n🔐 Giriş testi yapılıyor...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: consultantEmail,
      password: consultantPassword
    });

    if (loginError) {
      console.error('❌ Giriş başarısız:', loginError);
      return;
    }

    console.log('✅ Giriş başarılı!');
    console.log('  Kullanıcı ID:', loginData.user.id);
    console.log('  Email:', loginData.user.email);

    // 3. Rol kontrolü
    console.log('\n🎯 Rol kontrolü yapılıyor...');
    if (profile.role === 'consultant') {
      console.log('✅ Rol doğru: consultant');
    } else {
      console.log('❌ Rol yanlış:', profile.role);
      return;
    }

    // 4. Özet
    console.log('\n🎉 BAŞARILI! Danışman giriş sistemi düzgün çalışıyor');
    console.log('================================================');
    console.log('📧 Email:', consultantEmail);
    console.log('🔑 Şifre:', consultantPassword);
    console.log('🌐 Dashboard URL: http://localhost:5176');
    console.log('👤 Kullanıcı: Giorgi Meskhi');
    console.log('🏢 Şirket: Consulting19');
    console.log('💼 Rol: consultant');

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

finalVerification();