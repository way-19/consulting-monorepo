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
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Cloud Supabase Kullanıcı Kontrolü');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkExistingUsers() {
  try {
    console.log('\n📋 Auth Users Listesi:');
    
    // Auth users listele
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth users listelenemedi:', authError.message);
    } else {
      console.log(`✅ Toplam ${authUsers.users.length} auth user bulundu:`);
      authUsers.users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, ID: ${user.id}, Created: ${user.created_at}`);
      });
    }

    console.log('\n👤 User Profiles Tablosu:');
    
    // User profiles kontrol et
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profileError) {
      console.error('❌ User profiles alınamadı:', profileError.message);
    } else {
      console.log(`✅ Toplam ${profiles.length} user profile bulundu:`);
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. Email: ${profile.email}, Role: ${profile.role}, ID: ${profile.id}`);
      });
    }

    // Admin kullanıcısını özel olarak ara
    console.log('\n🔍 Admin Kullanıcısı Arama:');
    const adminEmails = ['admin@example.com', 'admin@test.com', 'admin@consulting.com'];
    
    for (const email of adminEmails) {
      const { data: adminProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (adminProfile) {
        console.log(`✅ Admin bulundu: ${email} - Role: ${adminProfile.role}`);
      }
    }

  } catch (error) {
    console.error('❌ Genel hata:', error.message);
  }
}

checkExistingUsers();