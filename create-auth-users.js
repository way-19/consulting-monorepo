import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur (service role ile)
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function createAuthUsers() {
  try {
    console.log('🔧 Test kullanıcılarını auth.users tablosuna ekliyorum...\n');
    
    const testUsers = [
      {
        id: '003fa4ec-2d0d-4f65-a053-7ceff0c59cc3',
        email: 'admin@consulting19.com',
        password: 'Admin123!',
        full_name: 'Admin User',
        role: 'admin'
      },
      {
        id: '226c80f3-e1c3-416b-8289-e2929942b2e1',
        email: 'giorgi.meskhi@consulting19.com',
        password: 'Consultant123!',
        full_name: 'Giorgi Meskhi',
        role: 'consultant'
      },
      {
        id: 'acb59967-6310-4460-af72-5693f921bc5f',
        email: 'client@consulting19.com',
        password: 'Client123!',
        full_name: 'María González',
        role: 'client'
      }
    ];
    
    for (const user of testUsers) {
      console.log(`👤 ${user.email} kullanıcısını oluşturuyorum...`);
      
      // Auth kullanıcısını oluştur
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Email'i otomatik onayla
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      });
      
      if (error) {
        console.error(`   ❌ Hata: ${error.message}`);
      } else {
        console.log(`   ✅ Başarılı! ID: ${data.user.id}`);
      }
    }
    
    console.log('\n🎉 Tüm kullanıcılar oluşturuldu!');
    console.log('🔍 Kontrol için auth kullanıcılarını listeliyorum...\n');
    
    // Oluşturulan kullanıcıları kontrol et
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Kullanıcıları getirirken hata:', error);
      return;
    }
    
    console.log(`📊 Toplam auth kullanıcısı: ${users.users.length}\n`);
    
    users.users.forEach((user, index) => {
      console.log(`👤 Kullanıcı ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   ✅ Email Confirmed: ${user.email_confirmed_at ? 'Evet' : 'Hayır'}`);
      console.log(`   🔑 ID: ${user.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('💥 Beklenmeyen hata:', error);
  }
}

createAuthUsers();