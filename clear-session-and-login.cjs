const { createClient } = require('@supabase/supabase-js');

async function clearSessionAndLogin() {
  console.log('🔄 Session temizleniyor ve admin girişi yapılıyor...\n');
  
  const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOEFJJwGGY0S0kF0JVyGz5eBQpq5X5HDI4p0');
  
  try {
    // First, sign out any existing session
    console.log('🚪 Mevcut session çıkış yapılıyor...');
    await supabase.auth.signOut();
    console.log('✅ Session temizlendi');
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now sign in as admin
    console.log('🔑 Admin olarak giriş yapılıyor...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Giriş hatası:', error.message);
      return;
    }
    
    console.log('✅ Admin girişi başarılı!');
    console.log('👤 Kullanıcı ID:', data.user.id);
    console.log('📧 Email:', data.user.email);
    console.log('🔑 Session ID:', data.session.access_token.substring(0, 20) + '...');
    
    // Verify profile access
    console.log('\n🔍 Profil erişimi kontrol ediliyor...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profil erişim hatası:', profileError.message);
    } else {
      console.log('✅ Profil erişimi başarılı!');
      console.log('👤 İsim:', profile.full_name);
      console.log('🔑 Rol:', profile.role);
    }
    
    console.log('\n🎉 Admin panel artık doğru kullanıcı ile çalışmalı!');
    console.log('🌐 Admin panel: http://localhost:5174');
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

clearSessionAndLogin();