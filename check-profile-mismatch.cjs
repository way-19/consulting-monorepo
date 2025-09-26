const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkProfileMismatch() {
  console.log('🔍 Checking profile and auth user mismatch...\n');

  try {
    // 1. Check all auth users
    console.log('1. All authentication users:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    authUsers.users.forEach(user => {
      console.log(`   - ${user.email}: ${user.id} (confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'})`);
    });

    // 2. Check all user profiles
    console.log('\n2. All user profiles:');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError);
      return;
    }

    if (profiles && profiles.length > 0) {
      profiles.forEach(profile => {
        console.log(`   - ${profile.email}: ${profile.id} (role: ${profile.role})`);
      });
    } else {
      console.log('   No profiles found');
    }

    // 3. Check for the specific IDs mentioned in the error
    const problematicId = 'd3e11540-bd33-4d45-a883-d7cd398b48ae';
    const profileId = '003fa4ec-2d0d-4f65-a853-7ceff0c59cc3';
    
    console.log(`\n3. Checking specific IDs:`);
    console.log(`   Frontend trying to access: ${problematicId}`);
    console.log(`   Profile ID from SQL: ${profileId}`);

    // Check if problematic ID exists in auth
    const problematicAuthUser = authUsers.users.find(user => user.id === problematicId);
    if (problematicAuthUser) {
      console.log(`   ✅ Problematic ID found in auth: ${problematicAuthUser.email}`);
    } else {
      console.log(`   ❌ Problematic ID NOT found in auth`);
    }

    // Check if profile ID exists in auth
    const profileAuthUser = authUsers.users.find(user => user.id === profileId);
    if (profileAuthUser) {
      console.log(`   ✅ Profile ID found in auth: ${profileAuthUser.email}`);
    } else {
      console.log(`   ❌ Profile ID NOT found in auth`);
    }

    // 4. Find admin user and profile
    console.log(`\n4. Admin user analysis:`);
    const adminAuthUser = authUsers.users.find(user => user.email === 'admin@consulting19.com');
    const adminProfile = profiles.find(profile => profile.email === 'admin@consulting19.com');

    if (adminAuthUser && adminProfile) {
      console.log(`   Auth ID: ${adminAuthUser.id}`);
      console.log(`   Profile ID: ${adminProfile.id}`);
      
      if (adminAuthUser.id === adminProfile.id) {
        console.log(`   ✅ IDs match!`);
      } else {
        console.log(`   ❌ IDs DO NOT match!`);
        console.log(`\n🔧 Need to fix this mismatch...`);
        
        // Update the profile to match the auth user ID
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ id: adminAuthUser.id })
          .eq('id', adminProfile.id);

        if (updateError) {
          console.error('❌ Error updating profile ID:', updateError);
        } else {
          console.log(`✅ Updated profile ID from ${adminProfile.id} to ${adminAuthUser.id}`);
        }
      }
    } else {
      if (!adminAuthUser) console.log(`   ❌ No admin auth user found`);
      if (!adminProfile) console.log(`   ❌ No admin profile found`);
    }

    console.log('\n🎉 Profile mismatch check completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkProfileMismatch();