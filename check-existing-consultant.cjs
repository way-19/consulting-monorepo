const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkExistingConsultant() {
  try {
    console.log('Mevcut consultant kaydını kontrol ediyorum...');
    
    // Belirtilen ID ile kayıt var mı kontrol et
    const { data: consultant, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', '226c80f3-e1c3-416b-8289-e2929942b2e1')
      .single();
    
    if (error) {
      console.log('Kayıt bulunamadı veya hata:', error);
      return;
    }
    
    if (consultant) {
      console.log('✅ Consultant kaydı mevcut:');
      console.log('ID:', consultant.id);
      console.log('Email:', consultant.email);
      console.log('Full Name:', consultant.full_name);
      console.log('Role:', consultant.role);
      console.log('Company:', consultant.company);
      console.log('Is Active:', consultant.is_active);
      console.log('Country ID:', consultant.country_id);
      console.log('Commission Rate:', consultant.commission_rate);
      console.log('Created At:', consultant.created_at);
      console.log('Updated At:', consultant.updated_at);
    } else {
      console.log('❌ Belirtilen ID ile consultant kaydı bulunamadı');
    }
    
    // Auth users tablosunda da kontrol et
    console.log('\nAuth users tablosunda kontrol ediyorum...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('Auth users kontrol hatası:', authError);
      return;
    }
    
    const consultantAuth = authUsers.users.find(user => 
      user.email === 'giorgi.meskhi@consulting19.com'
    );
    
    if (consultantAuth) {
      console.log('✅ Auth kaydı mevcut:');
      console.log('Auth ID:', consultantAuth.id);
      console.log('Email:', consultantAuth.email);
      console.log('Email Confirmed:', consultantAuth.email_confirmed_at ? 'Yes' : 'No');
      console.log('Created At:', consultantAuth.created_at);
    } else {
      console.log('❌ Auth kaydı bulunamadı');
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

checkExistingConsultant();