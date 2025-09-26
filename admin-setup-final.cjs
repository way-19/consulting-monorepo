const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function setupAdminFinal() {
  console.log('🔧 KALICI ADMIN KURULUMU BAŞLIYOR...\n');
  
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Mevcut admin kullanıcısını kontrol et
    console.log('1️⃣ Mevcut admin kullanıcısı kontrol ediliyor...');
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = existingUsers.users.find(u => u.email === 'admin@consulting19.com');
    
    let adminUserId;
    
    if (adminUser) {
      console.log('✅ Admin kullanıcısı mevcut:', adminUser.id);
      adminUserId = adminUser.id;
      
      // Şifreyi güncelle
      console.log('🔄 Admin şifresi güncelleniyor...');
      await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
        password: 'admin123',
        email_confirm: true
      });
      console.log('✅ Şifre güncellendi');
    } else {
      console.log('❌ Admin kullanıcısı bulunamadı, oluşturuluyor...');
      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin@consulting19.com',
        password: 'admin123',
        email_confirm: true
      });
      
      if (error) {
        console.error('❌ Admin kullanıcısı oluşturulamadı:', error.message);
        return;
      }
      
      adminUserId = newUser.user.id;
      console.log('✅ Admin kullanıcısı oluşturuldu:', adminUserId);
    }
    
    // 2. Admin profilini kontrol et ve oluştur
    console.log('\n2️⃣ Admin profili kontrol ediliyor...');
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', adminUserId)
      .single();
    
    if (existingProfile) {
      console.log('✅ Admin profili mevcut');
      
      // Rolü admin olarak güncelle
      await supabaseAdmin
        .from('user_profiles')
        .update({ role: 'admin', is_active: true })
        .eq('id', adminUserId);
      console.log('✅ Admin rolü güncellendi');
    } else {
      console.log('📝 Admin profili oluşturuluyor...');
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: adminUserId,
          email: 'admin@consulting19.com',
          full_name: 'Admin User',
          display_name: 'Admin',
          role: 'admin',
          is_active: true,
          preferred_language: 'tr',
          timezone: 'Europe/Istanbul'
        });
      
      if (profileError) {
        console.error('❌ Admin profili oluşturulamadı:', profileError.message);
        return;
      }
      console.log('✅ Admin profili oluşturuldu');
    }
    
    // 3. Authentication testi
    console.log('\n3️⃣ Authentication testi yapılıyor...');
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.error('❌ Authentication testi başarısız:', authError.message);
      return;
    }
    
    console.log('✅ Authentication testi başarılı!');
    console.log('🔑 User ID:', authData.user.id);
    
    // 4. Profile erişim testi
    console.log('\n4️⃣ Profile erişim testi yapılıyor...');
    const { data: profileData, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile erişim testi başarısız:', profileError.message);
      return;
    }
    
    console.log('✅ Profile erişim testi başarılı!');
    console.log('👤 Profil:', {
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      role: profileData.role
    });
    
    // 5. Admin panel için bilgileri kaydet
    console.log('\n5️⃣ Admin panel bilgileri kaydediliyor...');
    const adminInfo = {
      userId: adminUserId,
      email: 'admin@consulting19.com',
      password: 'admin123',
      setupDate: new Date().toISOString(),
      status: 'active'
    };
    
    require('fs').writeFileSync(
      'admin-credentials.json', 
      JSON.stringify(adminInfo, null, 2)
    );
    
    console.log('\n🎉 KALICI ADMIN KURULUMU TAMAMLANDI!');
    console.log('📧 Email: admin@consulting19.com');
    console.log('🔑 Şifre: admin123');
    console.log('🔗 Admin Panel: http://localhost:5174');
    console.log('💾 Bilgiler admin-credentials.json dosyasına kaydedildi');
    
    // Logout
    await supabaseClient.auth.signOut();
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

setupAdminFinal();