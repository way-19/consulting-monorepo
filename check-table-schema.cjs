const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkSchemaAndCreateProfile() {
  console.log('🔍 Checking Table Schema and Creating Profile');
  console.log('==============================================\n');

  try {
    const consultantId = '0365c5c2-cec2-4d71-a505-81b257901c64';
    
    // First, let's see what profiles exist to understand the schema
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (allError) {
      console.error('❌ Error fetching profiles:', allError);
    } else if (allProfiles && allProfiles.length > 0) {
      console.log('📋 Sample profile structure:');
      console.log('Available columns:', Object.keys(allProfiles[0]));
      console.log('Sample profile:', allProfiles[0]);
    } else {
      console.log('📋 No existing profiles found');
    }

    // Try with minimal required fields only
    console.log('\n🔧 Creating consultant profile with minimal fields...');

    const minimalProfile = {
      id: consultantId,
      email: 'giorgi.meskhi@consulting19.com',
      full_name: 'Giorgi Meskhi',
      first_name: 'Giorgi',
      last_name: 'Meskhi',
      role: 'consultant',
      company: 'Consulting19',
      is_active: true
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert(minimalProfile)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error with minimal profile:', insertError);
      
      // Try even more minimal
      console.log('\n🔄 Trying with absolute minimum fields...');
      
      const absoluteMinimal = {
        id: consultantId,
        email: 'giorgi.meskhi@consulting19.com',
        role: 'consultant'
      };

      const { data: minProfile, error: minError } = await supabase
        .from('user_profiles')
        .insert(absoluteMinimal)
        .select()
        .single();

      if (minError) {
        console.error('❌ Even minimal profile failed:', minError);
        return;
      }

      console.log('✅ Minimal profile created!');
      console.log('📋 Created Profile:', minProfile);
      return;
    }

    console.log('✅ Consultant profile created successfully!');
    console.log('📋 Created Profile:');
    console.log('  ID:', newProfile.id);
    console.log('  Email:', newProfile.email);
    console.log('  Name:', newProfile.full_name);
    console.log('  Role:', newProfile.role);
    console.log('  Company:', newProfile.company);
    console.log('  Active:', newProfile.is_active);

    // Now verify we can access it
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', consultantId)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying profile:', verifyError);
    } else {
      console.log('\n🎉 Verification successful!');
      console.log('  Role:', verification.role);
      console.log('  Email:', verification.email);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkSchemaAndCreateProfile();