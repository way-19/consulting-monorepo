const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deleteCreatedProfileAndFindReal() {
  console.log('🔄 Geri Alma İşlemi - Yanlış Profili Sil ve Gerçek Danışmanı Bul');
  console.log('================================================================\n');

  try {
    // 1. Oluşturduğum yanlış profili sil
    const createdProfileId = '0365c5c2-cec2-4d71-a505-81b257901c64';
    
    console.log('🗑️ Yanlış oluşturulan profili siliyorum...');
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', createdProfileId);

    if (deleteError) {
      console.error('❌ Profil silme hatası:', deleteError);
    } else {
      console.log('✅ Yanlış profil başarıyla silindi');
    }

    // 2. Tüm auth kullanıcılarını listele
    console.log('\n👥 Tüm auth kullanıcıları:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth kullanıcıları getirme hatası:', authError);
      return;
    }

    console.log('📋 Bulunan kullanıcılar:');
    authUsers.users.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email}`);
      console.log(`     ID: ${user.id}`);
      console.log(`     Oluşturma: ${user.created_at}`);
      console.log(`     Son giriş: ${user.last_sign_in_at || 'Hiç giriş yapmamış'}`);
      console.log('');
    });

    // 3. Mevcut user_profiles'ları listele
    console.log('👤 Mevcut user_profiles:');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profilesError) {
      console.error('❌ Profiller getirme hatası:', profilesError);
      return;
    }

    console.log('📋 Bulunan profiller:');
    profiles.forEach((profile, index) => {
      console.log(`  ${index + 1}. Email: ${profile.email}`);
      console.log(`     ID: ${profile.id}`);
      console.log(`     Ad: ${profile.full_name}`);
      console.log(`     Rol: ${profile.role}`);
      console.log(`     Şirket: ${profile.company}`);
      console.log('');
    });

    // 4. giorgi.meskhi@consulting19.com için auth kullanıcısını bul
    const targetEmail = 'giorgi.meskhi@consulting19.com';
    const targetAuthUser = authUsers.users.find(user => user.email === targetEmail);
    
    if (targetAuthUser) {
      console.log(`🎯 ${targetEmail} için auth kullanıcısı bulundu:`);
      console.log(`   ID: ${targetAuthUser.id}`);
      console.log(`   Email: ${targetAuthUser.email}`);
      console.log(`   Oluşturma: ${targetAuthUser.created_at}`);
      
      // Bu kullanıcının profili var mı kontrol et
      const existingProfile = profiles.find(p => p.id === targetAuthUser.id || p.email === targetEmail);
      
      if (existingProfile) {
        console.log(`\n📋 Mevcut profil bulundu:`);
        console.log(`   Rol: ${existingProfile.role}`);
        console.log(`   Şirket: ${existingProfile.company}`);
        console.log(`   Aktif: ${existingProfile.is_active}`);
        
        if (existingProfile.role !== 'consultant') {
          console.log(`\n🔄 Rol güncelleniyor: ${existingProfile.role} -> consultant`);
          
          const { data: updatedProfile, error: updateError } = await supabase
            .from('user_profiles')
            .update({ 
              role: 'consultant',
              company: 'Consulting19'
            })
            .eq('id', existingProfile.id)
            .select()
            .single();

          if (updateError) {
            console.error('❌ Rol güncelleme hatası:', updateError);
          } else {
            console.log('✅ Rol başarıyla güncellendi!');
            console.log(`   Yeni rol: ${updatedProfile.role}`);
          }
        } else {
          console.log('✅ Profil zaten consultant rolünde');
        }
      } else {
        console.log('\n❌ Bu auth kullanıcısı için profil bulunamadı');
        console.log('   Profil oluşturulması gerekiyor');
      }
    } else {
      console.log(`❌ ${targetEmail} için auth kullanıcısı bulunamadı`);
    }

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

deleteCreatedProfileAndFindReal();