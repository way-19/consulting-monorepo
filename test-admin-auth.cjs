const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function testAdminAuth() {
  console.log('🔐 Admin kimlik doğrulama testi başlıyor...\n');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Sign in as admin
    console.log('👤 Admin olarak giriş yapılıyor...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.error('❌ Giriş hatası:', authError.message);
      return;
    }
    
    console.log('✅ Giriş başarılı!');
    console.log('🔑 User ID:', authData.user.id);
    console.log('📧 Email:', authData.user.email);
    console.log('🎫 Access Token:', authData.session.access_token.substring(0, 50) + '...');
    
    // Test auth/v1/user endpoint
    console.log('\n🔍 auth/v1/user endpoint test ediliyor...');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User endpoint hatası:', userError.message);
    } else {
      console.log('✅ User endpoint başarılı!');
      console.log('👤 User data:', {
        id: userData.user.id,
        email: userData.user.email,
        email_confirmed_at: userData.user.email_confirmed_at
      });
    }
    
    // Test user_profiles query
    console.log('\n🔍 user_profiles query test ediliyor...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile query hatası:', profileError.message);
      console.error('❌ Profile error details:', profileError);
    } else {
      console.log('✅ Profile query başarılı!');
      console.log('👤 Profile data:', {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role,
        is_active: profileData.is_active
      });
    }
    
    // Test admin access to all profiles
    console.log('\n🔍 Admin tüm profillere erişim test ediliyor...');
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role');
    
    if (allProfilesError) {
      console.error('❌ All profiles query hatası:', allProfilesError.message);
      console.error('❌ All profiles error details:', allProfilesError);
    } else {
      console.log('✅ All profiles query başarılı!');
      console.log('📊 Toplam profil sayısı:', allProfiles.length);
      allProfiles.forEach((profile, index) => {
        console.log(`👤 Profil ${index + 1}:`, {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error.message);
  }
}

testAdminAuth();