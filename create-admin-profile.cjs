const { createClient } = require('@supabase/supabase-js');

async function createAdminProfile() {
  console.log('👤 Admin profil oluşturuluyor...\n');
  
  const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');
  
  try {
    // Find admin user
    console.log('🔍 Admin kullanıcısı aranıyor...');
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
    
    // Check if profile already exists
    console.log('🔍 Mevcut profil kontrol ediliyor...');
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();
    
    if (existingProfile) {
      console.log('✅ Admin profil zaten mevcut:', existingProfile.first_name, existingProfile.last_name);
      console.log('🔑 Rol:', existingProfile.role);
      return;
    }
    
    // Create admin profile
    console.log('📝 Admin profil oluşturuluyor...');
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        id: adminUser.id,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@consulting19.com',
        role: 'admin',
        is_active: true
      })
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Profil oluşturma hatası:', createError.message);
      return;
    }
    
    console.log('✅ Admin profil başarıyla oluşturuldu!');
    console.log('👤 İsim:', newProfile.first_name, newProfile.last_name);
    console.log('📧 Email:', newProfile.email);
    console.log('🔑 Rol:', newProfile.role);
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

createAdminProfile();