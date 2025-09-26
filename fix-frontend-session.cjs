const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function fixFrontendSession() {
  console.log('🔧 Frontend session sorunu düzeltiliyor...\n');
  
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Problemli user ID'yi kontrol et
    const problematicUserId = 'd3e11540-bd33-4d45-a883-d7cd398b48ae';
    console.log('🔍 Problemli user ID kontrol ediliyor:', problematicUserId);
    
    const { data: problematicUser } = await supabaseAdmin.auth.admin.getUserById(problematicUserId);
    
    if (problematicUser.user) {
      console.log('⚠️ Problemli user bulundu, siliniyor...');
      await supabaseAdmin.auth.admin.deleteUser(problematicUserId);
      console.log('✅ Problemli user silindi');
    } else {
      console.log('ℹ️ Problemli user zaten yok');
    }
    
    // 2. Doğru admin user'ı kontrol et
    console.log('\n🔍 Doğru admin user kontrol ediliyor...');
    const { data: adminUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = adminUsers.users.find(u => u.email === 'admin@consulting19.com');
    
    if (!adminUser) {
      console.error('❌ Admin user bulunamadı!');
      return;
    }
    
    console.log('✅ Admin user bulundu:', adminUser.id);
    
    // 3. Admin user'ın şifresini güncelle ve email'i confirm et
    console.log('🔄 Admin user güncelleniyor...');
    await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: 'admin123',
      email_confirm: true
    });
    console.log('✅ Admin user güncellendi');
    
    // 4. Admin profilini kontrol et
    console.log('\n🔍 Admin profili kontrol ediliyor...');
    const { data: adminProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();
    
    if (!adminProfile) {
      console.log('📝 Admin profili oluşturuluyor...');
      await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: adminUser.id,
          email: 'admin@consulting19.com',
          full_name: 'Admin User',
          display_name: 'Admin',
          role: 'admin',
          is_active: true,
          preferred_language: 'tr',
          timezone: 'Europe/Istanbul'
        });
      console.log('✅ Admin profili oluşturuldu');
    } else {
      console.log('✅ Admin profili mevcut');
      
      // Rolü admin olarak güncelle
      await supabaseAdmin
        .from('user_profiles')
        .update({ role: 'admin', is_active: true })
        .eq('id', adminUser.id);
      console.log('✅ Admin rolü güncellendi');
    }
    
    // 5. Test login
    console.log('\n🧪 Test login yapılıyor...');
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.error('❌ Test login başarısız:', authError.message);
      return;
    }
    
    console.log('✅ Test login başarılı!');
    console.log('🔑 Doğru User ID:', authData.user.id);
    
    // 6. Profile test
    const { data: profileData, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile test başarısız:', profileError.message);
      return;
    }
    
    console.log('✅ Profile test başarılı!');
    console.log('👤 Profil:', {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      role: profileData.role
    });
    
    // Logout
    await supabaseClient.auth.signOut();
    
    console.log('\n🎉 Frontend session sorunu düzeltildi!');
    console.log('📧 Email: admin@consulting19.com');
    console.log('🔑 Şifre: admin123');
    console.log('🔗 Admin Panel: http://localhost:5174');
    console.log('\n⚠️ ÖNEMLİ: Admin panelinde F5 yapın veya browser cache temizleyin!');
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

fixFrontendSession();