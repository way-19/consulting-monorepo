const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Create admin client for backend operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create regular client for frontend simulation
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function forceClearFrontendSession() {
  try {
    console.log('🧹 Frontend Session Temizleme Başlatılıyor...\n');

    // 1. Check current problematic session
    console.log('1️⃣ Mevcut session durumu kontrol ediliyor...');
    const { data: currentSession } = await supabaseClient.auth.getSession();
    
    if (currentSession.session) {
      console.log(`   📧 Mevcut session email: ${currentSession.session.user.email}`);
      console.log(`   🔑 Mevcut session user ID: ${currentSession.session.user.id}`);
      console.log('   ⚠️ Eski session tespit edildi, temizleniyor...');
    } else {
      console.log('   ✅ Aktif session bulunamadı');
    }

    // 2. Force sign out from all sessions
    console.log('\n2️⃣ Tüm sessionlardan çıkış yapılıyor...');
    await supabaseClient.auth.signOut({ scope: 'global' });
    console.log('   ✅ Global sign out tamamlandı');

    // 3. Clear any cached session data
    console.log('\n3️⃣ Cache temizleme işlemi...');
    
    // Clear localStorage if running in browser environment
    if (typeof localStorage !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`   🗑️ ${keysToRemove.length} cache anahtarı temizlendi`);
    }

    // 4. Verify correct admin user exists
    console.log('\n4️⃣ Doğru admin kullanıcısı kontrol ediliyor...');
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminUser = authUsers.users.find(u => u.email === 'admin@consulting19.com');
    
    if (!adminUser) {
      console.log('   ❌ Admin kullanıcısı bulunamadı!');
      return;
    }
    
    console.log(`   ✅ Admin kullanıcısı bulundu: ${adminUser.id}`);

    // 5. Verify admin profile exists and matches
    console.log('\n5️⃣ Admin profili kontrol ediliyor...');
    const { data: adminProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', 'admin@consulting19.com')
      .single();
    
    if (!adminProfile) {
      console.log('   📝 Admin profili oluşturuluyor...');
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
      console.log('   ✅ Admin profili oluşturuldu');
    } else if (adminProfile.id !== adminUser.id) {
      console.log('   🔄 Profil ID uyumsuzluğu tespit edildi, düzeltiliyor...');
      
      // Delete old profile
      await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('id', adminProfile.id);
      
      // Create new profile with correct ID
      await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: adminUser.id,
          email: 'admin@consulting19.com',
          full_name: adminProfile.full_name || 'Admin User',
          display_name: adminProfile.display_name || 'Admin',
          role: 'admin',
          is_active: true,
          preferred_language: adminProfile.preferred_language || 'tr',
          timezone: adminProfile.timezone || 'Europe/Istanbul'
        });
      
      console.log(`   ✅ Profil ID düzeltildi: ${adminProfile.id} → ${adminUser.id}`);
    } else {
      console.log('   ✅ Admin profili doğru ID ile eşleşiyor');
    }

    // 6. Test fresh login
    console.log('\n6️⃣ Temiz login testi yapılıyor...');
    const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });

    if (loginError) {
      console.error('   ❌ Login testi başarısız:', loginError.message);
      return;
    }

    console.log('   ✅ Login testi başarılı!');
    console.log(`   🔑 Yeni session user ID: ${loginData.user.id}`);

    // 7. Test profile access
    console.log('\n7️⃣ Profil erişim testi yapılıyor...');
    const { data: profileData, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    if (profileError) {
      console.error('   ❌ Profil erişim testi başarısız:', profileError.message);
      return;
    }

    console.log('   ✅ Profil erişim testi başarılı!');
    console.log(`   👤 Profil: ${profileData.full_name} (${profileData.role})`);

    // 8. Sign out after test
    await supabaseClient.auth.signOut();

    console.log('\n🎉 FRONTEND SESSION TEMİZLEME TAMAMLANDI!');
    console.log('📧 Email: admin@consulting19.com');
    console.log('🔑 Şifre: admin123');
    console.log('🔗 Admin Panel: http://localhost:5174');
    console.log('\n⚠️ ÖNEMLİ ADIMLAR:');
    console.log('1. Browser\'da F5 (hard refresh) yapın');
    console.log('2. Veya Ctrl+Shift+R (force refresh) kullanın');
    console.log('3. Veya incognito/private mode kullanın');
    console.log('4. Gerekirse browser cache\'ini tamamen temizleyin');

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

forceClearFrontendSession();