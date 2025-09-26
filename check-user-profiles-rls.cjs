const { createClient } = require('@supabase/supabase-js');

async function checkUserProfilesRLS() {
  console.log('🔒 User profiles RLS politikaları kontrol ediliyor...\n');
  
  const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU');
  
  try {
    // Test authenticated user access to user_profiles
    console.log('🧪 Authenticated kullanıcı erişim testi...');
    const authSupabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJleHAiOjE5ODM4MTI5OTZ9.qJkxhKGKVLxrOlFWw0B5-xg_2JkJSzqx9RxDzqPZQAo');
    
    const { data: authProfiles, error: authError } = await authSupabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (authError) {
      console.log('   ❌ Authenticated erişim hatası:', authError.message);
    } else {
      console.log('   ✅ Authenticated erişim başarılı:', authProfiles?.length || 0, 'profil');
    }
    
    // Test specific admin profile access
    console.log('\n🔍 Admin profil erişim testi...');
    const { data: adminProfile, error: adminError } = await authSupabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'admin@consulting19.com')
      .single();
    
    if (adminError) {
      console.log('   ❌ Admin profil erişim hatası:', adminError.message);
    } else {
      console.log('   ✅ Admin profil bulundu:', adminProfile.first_name, adminProfile.last_name);
      console.log('   🔑 Rol:', adminProfile.role);
    }
    
    // Check table permissions
    console.log('\n🔐 Tablo izinleri kontrol ediliyor...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT 
          grantee, 
          privilege_type 
        FROM information_schema.role_table_grants 
        WHERE table_name = 'user_profiles' 
        AND grantee IN ('authenticated', 'anon', 'public');` 
      });
    
    if (tableError) {
      console.log('   ❌ Tablo izinleri sorgu hatası:', tableError.message);
    } else {
      console.log('   📋 Tablo izinleri:', tableInfo?.length || 0, 'adet');
      if (tableInfo && tableInfo.length > 0) {
        tableInfo.forEach(info => {
          console.log('   🔑', info.grantee, ':', info.privilege_type);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

checkUserProfilesRLS();