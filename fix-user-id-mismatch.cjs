const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUserIdMismatch() {
  console.log('🔍 Checking current admin user state...\n');

  try {
    // 1. Check current auth users
    console.log('1. Checking authentication users:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    const adminAuthUser = authUsers.users.find(user => user.email === 'admin@consulting19.com');
    if (adminAuthUser) {
      console.log(`✅ Found admin auth user: ${adminAuthUser.email} (ID: ${adminAuthUser.id})`);
    } else {
      console.log('❌ No admin auth user found');
    }

    // 2. Check user profiles
    console.log('\n2. Checking user profiles:');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'admin@consulting19.com');

    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError);
      return;
    }

    if (profiles && profiles.length > 0) {
      const adminProfile = profiles[0];
      console.log(`✅ Found admin profile: ${adminProfile.email} (ID: ${adminProfile.id})`);
      
      // 3. Check if IDs match
      if (adminAuthUser && adminAuthUser.id !== adminProfile.id) {
        console.log(`\n⚠️  ID MISMATCH DETECTED:`);
        console.log(`   Auth User ID: ${adminAuthUser.id}`);
        console.log(`   Profile ID:   ${adminProfile.id}`);
        console.log(`\n🔧 Fixing by updating auth user ID to match profile ID...`);

        // Delete the old auth user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(adminAuthUser.id);
        if (deleteError) {
          console.error('❌ Error deleting old auth user:', deleteError);
          return;
        }
        console.log('✅ Deleted old auth user');

        // Create new auth user with the correct ID
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: 'admin@consulting19.com',
          password: 'admin123',
          email_confirm: true,
          user_metadata: {
            full_name: 'Admin User',
            role: 'admin'
          }
        });

        if (createError) {
          console.error('❌ Error creating new auth user:', createError);
          return;
        }

        console.log(`✅ Created new auth user: ${newUser.user.email} (ID: ${newUser.user.id})`);

        // Update the profile to use the new auth user ID
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ id: newUser.user.id })
          .eq('id', adminProfile.id);

        if (updateError) {
          console.error('❌ Error updating profile ID:', updateError);
          return;
        }

        console.log(`✅ Updated profile ID from ${adminProfile.id} to ${newUser.user.id}`);

        // Test login
        console.log('\n🧪 Testing login with new credentials...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'admin@consulting19.com',
          password: 'admin123'
        });

        if (loginError) {
          console.error('❌ Login test failed:', loginError);
          return;
        }

        console.log(`✅ Login successful! User ID: ${loginData.user.id}`);

        // Test profile access
        const { data: testProfile, error: testProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', loginData.user.id)
          .single();

        if (testProfileError) {
          console.error('❌ Profile access test failed:', testProfileError);
          return;
        }

        console.log(`✅ Profile access successful! Role: ${testProfile.role}`);

      } else if (adminAuthUser && adminAuthUser.id === adminProfile.id) {
        console.log('\n✅ IDs already match! No fix needed.');
        
        // Still test login to make sure everything works
        console.log('\n🧪 Testing current login...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'admin@consulting19.com',
          password: 'admin123'
        });

        if (loginError) {
          console.log('⚠️  Login failed, resetting password...');
          const { error: resetError } = await supabase.auth.admin.updateUserById(adminAuthUser.id, {
            password: 'admin123'
          });

          if (resetError) {
            console.error('❌ Password reset failed:', resetError);
            return;
          }

          console.log('✅ Password reset successful');
        } else {
          console.log(`✅ Login successful! User ID: ${loginData.user.id}`);
        }
      }
    } else {
      console.log('❌ No admin profile found');
    }

    console.log('\n🎉 User ID mismatch fix completed!');
    console.log('\n📋 Current admin credentials:');
    console.log('   Email: admin@consulting19.com');
    console.log('   Password: admin123');
    console.log('\n💡 Please refresh your browser or clear cache to use the updated session.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixUserIdMismatch();