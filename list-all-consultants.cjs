const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function listAllConsultants() {
  try {
    console.log('Tüm consultant kayıtlarını listeliyorum...');
    
    // Tüm consultant kayıtlarını getir
    const { data: consultants, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'consultant');
    
    if (error) {
      console.log('Hata:', error);
      return;
    }
    
    if (consultants && consultants.length > 0) {
      console.log(`✅ ${consultants.length} consultant kaydı bulundu:`);
      consultants.forEach((consultant, index) => {
        console.log(`\n--- Consultant ${index + 1} ---`);
        console.log('ID:', consultant.id);
        console.log('Email:', consultant.email);
        console.log('Full Name:', consultant.full_name);
        console.log('Company:', consultant.company);
        console.log('Is Active:', consultant.is_active);
        console.log('Created At:', consultant.created_at);
      });
    } else {
      console.log('❌ Hiç consultant kaydı bulunamadı');
    }
    
    // Giorgi email'i ile kayıt var mı kontrol et
    console.log('\n--- Giorgi email kontrolü ---');
    const { data: giorgiRecord, error: giorgiError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'giorgi.meskhi@consulting19.com')
      .single();
    
    if (giorgiRecord) {
      console.log('✅ Giorgi email ile kayıt bulundu:');
      console.log('ID:', giorgiRecord.id);
      console.log('Full Name:', giorgiRecord.full_name);
      console.log('Role:', giorgiRecord.role);
    } else {
      console.log('❌ Giorgi email ile kayıt bulunamadı');
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

listAllConsultants();