const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function insertConsultantProfile() {
  try {
    console.log('Kullanıcının sağladığı INSERT komutunu çalıştırıyorum...');
    
    // Önce mevcut kaydı kontrol et
    const { data: existing, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', '226c80f3-e1c3-416b-8289-e2929942b2e1')
      .single();
    
    if (existing) {
      console.log('Bu ID ile kayıt zaten mevcut:', existing);
      console.log('Mevcut kaydı siliyorum...');
      
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', '226c80f3-e1c3-416b-8289-e2929942b2e1');
      
      if (deleteError) {
        console.error('Silme hatası:', deleteError);
        return;
      }
      console.log('Mevcut kayıt silindi.');
    }
    
    // Kullanıcının sağladığı tam INSERT verilerini kullan
    const insertData = {
      id: '226c80f3-e1c3-416b-8289-e2929942b2e1',
      email: 'giorgi.meskhi@consulting19.com',
      full_name: 'Giorgi Meskhi',
      display_name: '',
      role: 'consultant',
      country_id: 'b078d0fb-86a4-48dc-ba83-5d600479e074',
      phone: '',
      company: 'Meskhi & Associates',
      avatar_url: null,
      preferred_language: 'en',
      timezone: 'Asia/Tbilisi',
      is_active: true,
      metadata: {"is_translator": false, "spoken_languages": ["en", "tr"]},
      created_at: '2025-09-02 07:05:27.919224+00',
      updated_at: '2025-09-25 20:09:56.319906+00',
      storage_limit_gb: 5.00,
      storage_used_bytes: 0,
      last_file_activity: '2025-09-06 04:29:21.395913+00',
      mfa_enabled: false,
      mfa_secret: null,
      backup_codes: null,
      mfa_enrolled_at: null,
      commission_rate: 65.00
    };
    
    console.log('Yeni consultant profili ekleniyor...');
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Ekleme hatası:', error);
      return;
    }
    
    console.log('✅ Consultant profili başarıyla eklendi:', data[0]);
    
    // Doğrulama için tekrar kontrol et
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', '226c80f3-e1c3-416b-8289-e2929942b2e1')
      .single();
    
    if (verifyError) {
      console.error('Doğrulama hatası:', verifyError);
      return;
    }
    
    console.log('✅ Doğrulama başarılı - Kayıt mevcut:', {
      id: verification.id,
      email: verification.email,
      full_name: verification.full_name,
      role: verification.role,
      company: verification.company,
      is_active: verification.is_active
    });
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

insertConsultantProfile();