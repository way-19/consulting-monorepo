import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur (service role ile)
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function checkAuthUsers() {
  try {
    console.log('🔍 Supabase auth kullanıcılarını kontrol ediyorum...\n');
    
    // Auth kullanıcılarını listele (service role ile)
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Kullanıcıları getirirken hata:', error);
      return;
    }
    
    console.log(`📊 Toplam kullanıcı sayısı: ${users.users.length}\n`);
    
    if (users.users.length === 0) {
      console.log('⚠️  Hiç kullanıcı bulunamadı!');
      console.log('💡 Test kullanıcıları oluşturulması gerekiyor.\n');
      return;
    }
    
    // Kullanıcıları listele
    users.users.forEach((user, index) => {
      console.log(`👤 Kullanıcı ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   ✅ Email Confirmed: ${user.email_confirmed_at ? 'Evet' : 'Hayır'}`);
      console.log(`   📅 Oluşturulma: ${new Date(user.created_at).toLocaleString('tr-TR')}`);
      console.log(`   🔑 ID: ${user.id}`);
      console.log(`   📋 Metadata:`, user.user_metadata);
      console.log('');
    });
    
    // Test kullanıcılarını kontrol et
    const testEmails = [
      'admin@consulting19.com',
      'giorgi.meskhi@consulting19.com', 
      'client@consulting19.com'
    ];
    
    console.log('🎯 Test kullanıcıları kontrolü:');
    testEmails.forEach(email => {
      const found = users.users.find(u => u.email === email);
      if (found) {
        console.log(`   ✅ ${email} - Mevcut (Email confirmed: ${found.email_confirmed_at ? 'Evet' : 'Hayır'})`);
      } else {
        console.log(`   ❌ ${email} - Bulunamadı`);
      }
    });
    
  } catch (error) {
    console.error('💥 Beklenmeyen hata:', error);
  }
}

checkAuthUsers();