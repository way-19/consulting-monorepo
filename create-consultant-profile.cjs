const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createConsultantProfile() {
  console.log('🔧 Creating consultant user profile...');
  
  try {
    // First, get the consultant user ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    console.log('📊 Found auth users:', authUsers.users.length);
    
    const consultantUser = authUsers.users.find(user => user.email === 'giorgi.meskhi@consulting19.com');
    
    if (!consultantUser) {
      console.error('❌ Consultant user not found in auth.users');
      return;
    }
    
    console.log('👤 Found consultant user:', consultantUser.id);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', consultantUser.id)
      .single();
    
    if (existingProfile) {
      console.log('✅ Consultant profile already exists:', existingProfile);
      return;
    }
    
    // Create consultant profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: consultantUser.id,
        email: consultantUser.email,
        role: 'consultant',
        first_name: 'Giorgi',
        last_name: 'Meskhi',
        phone: '+90 555 123 4567',
        bio_en: 'Experienced business consultant specializing in international business development.',
        bio_tr: 'Uluslararası iş geliştirme konusunda uzman deneyimli iş danışmanı.',
        experience_years: 8,
        hourly_rate: 150.00,
        is_active: true,
        company: 'Consulting19',
        timezone: 'Europe/Istanbul',
        commission_rate: 65.00
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Error creating consultant profile:', profileError);
      return;
    }
    
    console.log('✅ Consultant profile created successfully:', profile);
    
    // Verify the profile was created
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'consultant');
    
    if (verifyError) {
      console.error('❌ Error verifying profile:', verifyError);
      return;
    }
    
    console.log('🎉 Verification - Found consultant profiles:', verifyProfile.length);
    verifyProfile.forEach(profile => {
      console.log(`   📧 ${profile.email} - ${profile.full_name} (${profile.role})`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createConsultantProfile();