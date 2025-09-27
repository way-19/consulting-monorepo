const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixMissingProfile() {
  console.log('🔍 Checking Auth Users and Creating Missing Profile');
  console.log('==================================================\n');

  try {
    // First, let's check auth.users to get the user ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    console.log('👥 Found', authUsers.users.length, 'auth users:');
    authUsers.users.forEach(user => {
      console.log(`  📧 ${user.email} - ID: ${user.id} - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    });

    // Find our consultant user
    const consultantUser = authUsers.users.find(user => user.email === 'giorgi.meskhi@consulting19.com');
    
    if (!consultantUser) {
      console.log('❌ Consultant user not found in auth.users');
      return;
    }

    console.log('\n✅ Found consultant in auth.users:');
    console.log('  ID:', consultantUser.id);
    console.log('  Email:', consultantUser.email);
    console.log('  Confirmed:', consultantUser.email_confirmed_at ? 'Yes' : 'No');

    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', consultantUser.id)
      .single();

    if (!profileError && existingProfile) {
      console.log('\n📋 Profile already exists:');
      console.log('  Role:', existingProfile.role);
      console.log('  Email:', existingProfile.email);
      console.log('  Name:', existingProfile.full_name);
      
      if (existingProfile.role !== 'consultant') {
        console.log('\n🔧 Updating role to consultant...');
        const { data: updated, error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'consultant' })
          .eq('id', consultantUser.id)
          .select()
          .single();
          
        if (updateError) {
          console.error('❌ Error updating role:', updateError);
        } else {
          console.log('✅ Role updated to consultant!');
        }
      }
      return;
    }

    console.log('\n🔧 Creating missing consultant profile...');

    // Create the consultant profile
    const profileData = {
      id: consultantUser.id,
      email: 'giorgi.meskhi@consulting19.com',
      full_name: 'Giorgi Meskhi',
      first_name: 'Giorgi',
      last_name: 'Meskhi',
      role: 'consultant',
      company: 'Consulting19',
      phone: '+995 555 123 456',
      country_id: 'b078d0fb-86a4-48dc-ba83-5d600479e074', // Georgia
      bio_en: 'Experienced business consultant specializing in international business development.',
      bio_tr: 'Uluslararası iş geliştirme konusunda uzman deneyimli iş danışmanı.',
      experience_years: 8,
      hourly_rate: 150.00,
      is_active: true,
      timezone: 'Asia/Tbilisi',
      commission_rate: 65.00,
      storage_limit_gb: 5.00,
      storage_used_bytes: 0,
      mfa_enabled: false,
      metadata: {}
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating profile:', insertError);
      return;
    }

    console.log('✅ Consultant profile created successfully!');
    console.log('📋 New Profile:');
    console.log('  ID:', newProfile.id);
    console.log('  Email:', newProfile.email);
    console.log('  Name:', newProfile.full_name);
    console.log('  Role:', newProfile.role);
    console.log('  Company:', newProfile.company);
    console.log('  Active:', newProfile.is_active);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixMissingProfile();