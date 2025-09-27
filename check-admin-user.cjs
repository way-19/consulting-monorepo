const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// .env dosyasını manuel oku
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const anonKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function checkAdminUser() {
  try {
    console.log('🔍 Admin kullanıcısını kontrol ediyorum...');
    console.log('📡 Supabase URL:', supabaseUrl);
    
    // User profiles tablosunda admin kullanıcısını ara
    const { data: profileUsers, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'admin@consulting19.com');
    
    if (profileError) {
      console.error('❌ Profile kullanıcıları alınamadı:', profileError);
    } else {
      console.log('👥 Profile tablosunda admin kullanıcısı:', profileUsers.length > 0 ? 'MEVCUT' : 'YOK');
      
      if (profileUsers.length > 0) {
        const profile = profileUsers[0];
        console.log('📧 Email:', profile.email);
        console.log('👤 İsim:', profile.full_name);
        console.log('🎭 Rol:', profile.role);
        console.log('✅ Aktif:', profile.is_active);
      }
    }
    
    console.log('\n📋 Tüm profile kullanıcıları:');
    if (!profileError) {
      const { data: allProfiles } = await supabase
        .from('user_profiles')
        .select('email, role, is_active');
      
      if (allProfiles) {
        allProfiles.forEach(profile => {
          console.log(`- ${profile.email} (${profile.role}) - ${profile.is_active ? 'Aktif' : 'Pasif'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

checkAdminUser();