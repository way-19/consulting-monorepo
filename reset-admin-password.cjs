const { createClient } = require('@supabase/supabase-js');

async function resetAdminPassword() {
  console.log('🔑 Admin şifresi sıfırlanıyor...\n');
  
  const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');
  
  try {
    // Find admin user
    console.log('🔍 Admin kullanıcısı bulunuyor...');
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Kullanıcı listesi alınamadı:', userError.message);
      return;
    }
    
    const adminUser = users.users.find(user => user.email === 'admin@consulting19.com');
    
    if (!adminUser) {
      console.error('❌ Admin kullanıcısı bulunamadı!');
      return;
    }
    
    console.log('✅ Admin kullanıcısı bulundu:', adminUser.id);
    
    // Update admin password
    console.log('🔄 Admin şifresi güncelleniyor...');
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { 
        password: 'admin123',
        email_confirm: true
      }
    );
    
    if (error) {
      console.error('❌ Şifre güncelleme hatası:', error.message);
      return;
    }
    
    console.log('✅ Admin şifresi başarıyla güncellendi!');
    console.log('📧 Email:', data.user.email);
    console.log('🔑 Yeni şifre: admin123');
    
    // Test login
    console.log('\n🧪 Giriş testi yapılıyor...');
    const anonSupabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOEFJJwGGY0S0kF0JVyGz5eBQpq5X5HDI4p0');
    
    const { data: loginData, error: loginError } = await anonSupabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (loginError) {
      console.error('❌ Giriş testi hatası:', loginError.message);
    } else {
      console.log('✅ Giriş testi başarılı!');
      console.log('👤 Giriş yapan kullanıcı ID:', loginData.user.id);
      
      // Sign out after test
      await anonSupabase.auth.signOut();
    }
    
    console.log('\n🎉 Admin şifresi hazır! Artık admin panelde giriş yapabilirsiniz.');
    console.log('📧 Email: admin@consulting19.com');
    console.log('🔑 Şifre: admin123');
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

resetAdminPassword();