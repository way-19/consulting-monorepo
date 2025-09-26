const { createClient } = require('@supabase/supabase-js');

async function debugUserMismatch() {
  console.log('🔍 User ID mismatch sorunu araştırılıyor...\n');
  
  const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');
  
  try {
    // Check all auth users
    console.log('👥 Tüm auth kullanıcıları kontrol ediliyor...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth kullanıcıları alınamadı:', authError.message);
      return;
    }
    
    console.log(`📊 Toplam auth kullanıcısı: ${authUsers.users.length}\n`);
    
    authUsers.users.forEach((user, index) => {
      console.log(`👤 Kullanıcı ${index + 1}:`);
      console.log(`   🔑 ID: ${user.id}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   ✅ Email Confirmed: ${user.email_confirmed_at ? 'Evet' : 'Hayır'}`);
      console.log(`   📅 Created: ${user.created_at}`);
      console.log('');
    });
    
    // Check all user profiles
    console.log('👤 Tüm user profilleri kontrol ediliyor...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profileError) {
      console.error('❌ User profilleri alınamadı:', profileError.message);
      return;
    }
    
    console.log(`📊 Toplam user profili: ${profiles.length}\n`);
    
    profiles.forEach((profile, index) => {
      console.log(`👤 Profil ${index + 1}:`);
      console.log(`   🔑 ID: ${profile.id}`);
      console.log(`   📧 Email: ${profile.email}`);
      console.log(`   👤 İsim: ${profile.full_name || profile.first_name + ' ' + profile.last_name}`);
      console.log(`   🔑 Rol: ${profile.role}`);
      console.log(`   ✅ Aktif: ${profile.is_active}`);
      console.log('');
    });
    
    // Check for admin email specifically
    const adminEmail = 'admin@consulting19.com';
    console.log(`🔍 ${adminEmail} için eşleşme kontrol ediliyor...\n`);
    
    const authAdmin = authUsers.users.find(u => u.email === adminEmail);
    const profileAdmin = profiles.find(p => p.email === adminEmail);
    
    if (authAdmin) {
      console.log(`✅ Auth'da admin bulundu: ${authAdmin.id}`);
    } else {
      console.log('❌ Auth\'da admin bulunamadı');
    }
    
    if (profileAdmin) {
      console.log(`✅ Profile'da admin bulundu: ${profileAdmin.id}`);
    } else {
      console.log('❌ Profile\'da admin bulunamadı');
    }
    
    if (authAdmin && profileAdmin) {
      if (authAdmin.id === profileAdmin.id) {
        console.log('✅ IDler eşleşiyor!');
      } else {
        console.log('❌ IDler eşleşmiyor!');
        console.log(`   Auth ID: ${authAdmin.id}`);
        console.log(`   Profile ID: ${profileAdmin.id}`);
        console.log('\n🔧 Bu sorunu düzeltmek gerekiyor...');
      }
    }
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

debugUserMismatch();