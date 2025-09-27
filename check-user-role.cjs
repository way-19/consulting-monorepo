const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAndFixUserRole() {
  console.log('🔍 Checking User Role for giorgi.meskhi@consulting19.com');
  console.log('=====================================================\n');

  try {
    // First, check the current user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'giorgi.meskhi@consulting19.com')
      .single();

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      return;
    }

    if (!profile) {
      console.log('❌ No profile found for giorgi.meskhi@consulting19.com');
      return;
    }

    console.log('📋 Current User Profile:');
    console.log('  ID:', profile.id);
    console.log('  Email:', profile.email);
    console.log('  Full Name:', profile.full_name);
    console.log('  Current Role:', profile.role);
    console.log('  Company:', profile.company);
    console.log('  Is Active:', profile.is_active);

    if (profile.role === 'consultant') {
      console.log('✅ User already has consultant role!');
      return;
    }

    console.log('\n🔧 Updating role from', profile.role, 'to consultant...');

    // Update the role to consultant
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        role: 'consultant',
        company: 'Consulting19',
        is_active: true
      })
      .eq('email', 'giorgi.meskhi@consulting19.com')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating user role:', updateError);
      return;
    }

    console.log('✅ Role updated successfully!');
    console.log('📋 Updated User Profile:');
    console.log('  ID:', updatedProfile.id);
    console.log('  Email:', updatedProfile.email);
    console.log('  Full Name:', updatedProfile.full_name);
    console.log('  New Role:', updatedProfile.role);
    console.log('  Company:', updatedProfile.company);
    console.log('  Is Active:', updatedProfile.is_active);

    // Verify the change
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('role, email, full_name')
      .eq('email', 'giorgi.meskhi@consulting19.com')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
      return;
    }

    console.log('\n🎉 Verification successful!');
    console.log('  Email:', verification.email);
    console.log('  Name:', verification.full_name);
    console.log('  Role:', verification.role);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAndFixUserRole();