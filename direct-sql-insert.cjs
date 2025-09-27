const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function directSqlInsert() {
  try {
    console.log('Doğrudan SQL ile INSERT yapıyorum...');
    
    const sqlQuery = `
      INSERT INTO "public"."user_profiles" 
      ("id", "email", "full_name", "display_name", "role", "country_id", "phone", "company", "avatar_url", "preferred_language", "timezone", "is_active", "metadata", "created_at", "updated_at", "storage_limit_gb", "storage_used_bytes", "last_file_activity", "mfa_enabled", "mfa_secret", "backup_codes", "mfa_enrolled_at", "commission_rate") 
      VALUES 
      ('226c80f3-e1c3-416b-8289-e2929942b2e1', 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', '', 'consultant', 'b078d0fb-86a4-48dc-ba83-5d600479e074', '', 'Meskhi & Associates', null, 'en', 'Asia/Tbilisi', 'true', '{"is_translator": false, "spoken_languages": ["en", "tr"]}', '2025-09-02 07:05:27.919224+00', '2025-09-25 20:09:56.319906+00', '5.00', '0', '2025-09-06 04:29:21.395913+00', 'false', null, null, null, '65.00');
    `;
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlQuery });
    
    if (error) {
      console.error('SQL hatası:', error);
      
      // Alternatif olarak doğrudan .sql() metodunu deneyelim
      console.log('Alternatif yöntem deneniyor...');
      const { data: data2, error: error2 } = await supabase
        .from('user_profiles')
        .insert({
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
        })
        .select();
      
      if (error2) {
        console.error('Alternatif yöntem de başarısız:', error2);
        return;
      }
      
      console.log('✅ Alternatif yöntemle başarılı:', data2);
    } else {
      console.log('✅ SQL ile başarılı:', data);
    }
    
    // Doğrulama
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', '226c80f3-e1c3-416b-8289-e2929942b2e1')
      .single();
    
    if (verification) {
      console.log('✅ Doğrulama başarılı - Kayıt eklendi:', {
        id: verification.id,
        email: verification.email,
        full_name: verification.full_name,
        role: verification.role,
        company: verification.company
      });
    }
    
  } catch (error) {
    console.error('Genel hata:', error);
  }
}

directSqlInsert();