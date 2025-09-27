const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createRealConsultantProfile() {
  console.log('👨‍💼 Gerçek Danışman Profili Oluşturma');
  console.log('====================================\n');

  try {
    const realConsultantId = '0365c5c2-cec2-4d71-a505-81b257901c64';
    const consultantEmail = 'giorgi.meskhi@consulting19.com';
    
    // Önce profil var mı kontrol et
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', realConsultantId)
      .single();

    if (existingProfile) {
      console.log('📋 Profil zaten mevcut!');
      console.log('  Rol:', existingProfile.role);
      console.log('  Email:', existingProfile.email);
      return;
    }

    console.log('🔧 Gerçek danışman için profil oluşturuluyor...');
    console.log(`   Auth ID: ${realConsultantId}`);
    console.log(`   Email: ${consultantEmail}`);

    // Gerçek danışman profili oluştur
    const consultantProfile = {
      id: realConsultantId,
      user_id: realConsultantId,
      first_name: 'Giorgi',
      last_name: 'Meskhi',
      email: consultantEmail,
      phone: '+995-555-0123',
      role: 'consultant',
      company: 'Consulting19',
      is_active: true,
      experience_years: 5,
      hourly_rate: 150,
      timezone: 'Asia/Tbilisi',
      commission_rate: 65,
      bio_en: 'Experienced business consultant specializing in company formation and business development.',
      bio_tr: 'Şirket kuruluşu ve iş geliştirme konularında uzman deneyimli iş danışmanı.',
      bio_es: 'Consultor empresarial experimentado especializado en formación de empresas y desarrollo empresarial.',
      bio_pt: 'Consultor empresarial experiente especializado em formação de empresas e desenvolvimento empresarial.'
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert(consultantProfile)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Profil oluşturma hatası:', insertError);
      return;
    }

    console.log('✅ Gerçek danışman profili başarıyla oluşturuldu!');
    console.log('📋 Profil Detayları:');
    console.log('  ID:', newProfile.id);
    console.log('  Email:', newProfile.email);
    console.log('  Ad Soyad:', newProfile.full_name);
    console.log('  Rol:', newProfile.role);
    console.log('  Şirket:', newProfile.company);
    console.log('  Aktif:', newProfile.is_active);
    console.log('  Deneyim:', newProfile.experience_years, 'yıl');
    console.log('  Saatlik Ücret: $' + newProfile.hourly_rate);

    // Profil erişimini doğrula
    console.log('\n🔍 Profil erişimi doğrulanıyor...');
    
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, company, is_active')
      .eq('email', consultantEmail)
      .single();

    if (verifyError) {
      console.error('❌ Profil doğrulama hatası:', verifyError);
    } else {
      console.log('✅ Profil doğrulama başarılı!');
      console.log('  Bulunan:', verification.full_name);
      console.log('  Rol:', verification.role);
      console.log('  Şirket:', verification.company);
      console.log('  Aktif:', verification.is_active);
    }

    // Giriş testi yap
    console.log('\n🔐 Giriş testi yapılıyor...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: consultantEmail,
      password: 'consultant123'
    });

    if (loginError) {
      console.error('❌ Giriş testi hatası:', loginError);
    } else {
      console.log('✅ Giriş testi başarılı!');
      console.log('  Kullanıcı ID:', loginData.user.id);
      console.log('  Email:', loginData.user.email);
    }

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

createRealConsultantProfile();