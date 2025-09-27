const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createConsultantProfile() {
  console.log('🔧 Creating Consultant Profile (Final)');
  console.log('=====================================\n');

  try {
    const consultantId = '0365c5c2-cec2-4d71-a505-81b257901c64';
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', consultantId)
      .single();

    if (existingProfile) {
      console.log('📋 Profile already exists!');
      console.log('  Current role:', existingProfile.role);
      
      if (existingProfile.role !== 'consultant') {
        console.log('🔄 Updating role to consultant...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            role: 'consultant',
            company: 'Consulting19'
          })
          .eq('id', consultantId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating role:', updateError);
          return;
        }

        console.log('✅ Role updated successfully!');
        console.log('  New role:', updatedProfile.role);
        console.log('  Company:', updatedProfile.company);
      } else {
        console.log('✅ Profile already has consultant role!');
      }
      return;
    }

    // Create new profile with required fields
    console.log('🔧 Creating new consultant profile...');

    const consultantProfile = {
      id: consultantId,
      user_id: consultantId, // Same as auth user ID
      first_name: 'Giorgi',
      last_name: 'Meskhi',
      email: 'giorgi.meskhi@consulting19.com',
      phone: '+995-555-0123',
      role: 'consultant',
      company: 'Consulting19',
      is_active: true,
      experience_years: 5,
      hourly_rate: 150,
      timezone: 'Asia/Tbilisi',
      commission_rate: 65
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert(consultantProfile)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating profile:', insertError);
      return;
    }

    console.log('✅ Consultant profile created successfully!');
    console.log('📋 Profile Details:');
    console.log('  ID:', newProfile.id);
    console.log('  Email:', newProfile.email);
    console.log('  Full Name:', newProfile.full_name);
    console.log('  Role:', newProfile.role);
    console.log('  Company:', newProfile.company);
    console.log('  Active:', newProfile.is_active);
    console.log('  Experience:', newProfile.experience_years, 'years');
    console.log('  Hourly Rate:', '$' + newProfile.hourly_rate);

    // Verify the profile can be accessed
    console.log('\n🔍 Verifying profile access...');
    
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, company, is_active')
      .eq('email', 'giorgi.meskhi@consulting19.com')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying profile:', verifyError);
    } else {
      console.log('✅ Profile verification successful!');
      console.log('  Found:', verification.full_name);
      console.log('  Role:', verification.role);
      console.log('  Company:', verification.company);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createConsultantProfile();