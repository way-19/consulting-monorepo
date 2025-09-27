const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// .env dosyasından production Supabase bilgilerini oku
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
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Canlı Supabase Değişiklik Kontrolü');
console.log('URL:', supabaseUrl);
console.log('Timestamp:', new Date().toLocaleString());
console.log('=' .repeat(50));

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLiveChanges() {
  try {
    // 1. Bağlantı ve User Profiles testi
    console.log('\n1️⃣ User Profiles Kontrolü...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, role, full_name, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Profiles hatası:', profilesError.message);
    } else {
      console.log(`✅ ${profiles?.length || 0} profil bulundu:`);
      profiles?.forEach(profile => {
        const createdDate = new Date(profile.created_at).toLocaleDateString();
        console.log(`  - ${profile.email} (${profile.role}) - ${profile.full_name || 'İsim yok'} [${createdDate}]`);
      });
    }

    // 2. Mevcut tabloları listele
    console.log('\n2️⃣ Mevcut Tablolar Kontrolü...');
    const tables = ['user_profiles', 'clients', 'projects', 'tasks', 'notifications'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`  ❌ ${table}: ${error.message}`);
        } else {
          console.log(`  ✅ ${table}: ${data?.length || 0} kayıt`);
        }
      } catch (err) {
        console.log(`  ⚠️ ${table}: Erişim hatası`);
      }
    }

    // 3. Authentication test
    console.log('\n3️⃣ Authentication Test...');
    try {
      const { data: authTest, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      
      if (authError) {
        console.log('✅ Auth endpoint çalışıyor (beklenen hata):', authError.message);
      }
    } catch (err) {
      console.log('✅ Auth sistem aktif');
    }

    // 4. Real-time test
    console.log('\n4️⃣ Real-time Bağlantı...');
    let realtimeConnected = false;
    
    const channel = supabase
      .channel('live-test')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('🔄 Real-time değişiklik:', payload.eventType);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription aktif');
          realtimeConnected = true;
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ Real-time bağlantı hatası');
        } else {
          console.log('ℹ️ Real-time durumu:', status);
        }
      });

    // 5. Son değişiklik zamanı
    console.log('\n5️⃣ Son Aktivite Kontrolü...');
    const { data: lastActivity, error: activityError } = await supabase
      .from('user_profiles')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (!activityError && lastActivity?.length > 0) {
      const lastUpdate = new Date(lastActivity[0].updated_at);
      const timeDiff = Date.now() - lastUpdate.getTime();
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      
      console.log(`✅ Son güncelleme: ${lastUpdate.toLocaleString()} (${minutesAgo} dakika önce)`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Canlı kontrol tamamlandı!');
    console.log('🕐 Test zamanı:', new Date().toLocaleString());

    // Clean up
    setTimeout(() => {
      supabase.removeAllChannels();
      process.exit(0);
    }, 1000);

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
    process.exit(1);
  }
}

testLiveChanges();