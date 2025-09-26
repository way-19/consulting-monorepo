import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur (service role ile)
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function checkAndFixAdminUser() {
  try {
    const adminEmail = 'admin@consulting19.com';
    
    console.log(`🔍 Checking admin user: ${adminEmail}...\n`);

    // Get the admin user from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    const adminUser = authUsers.users.find(user => user.email === adminEmail);
    
    if (!adminUser) {
      console.error(`❌ Admin user ${adminEmail} not found in auth.users`);
      return;
    }

    console.log(`✅ Found admin user in auth.users:`);
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Metadata:`, adminUser.user_metadata);

    // Check if admin user exists in user_profiles
    const { data: adminProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking user_profiles:', profileError);
      return;
    }

    if (adminProfile) {
      console.log(`\n📋 Current admin profile:`);
      console.log(`   ID: ${adminProfile.id}`);
      console.log(`   Email: ${adminProfile.email}`);
      console.log(`   Full Name: ${adminProfile.full_name}`);
      console.log(`   Current Role: ${adminProfile.role}`);

      if (adminProfile.role === 'admin') {
        console.log('\n✅ Admin user already has admin role!');
        
        // Test login
        console.log('\n🔐 Testing admin login...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: 'Admin123!'
        });

        if (loginError) {
          console.error('❌ Admin login failed:', loginError.message);
        } else {
          console.log('✅ Admin login successful!');
          console.log('Session user metadata:', loginData.user.user_metadata);
          
          // Logout
          await supabase.auth.signOut();
        }
        return;
      }

      // Update the role to admin
      console.log(`\n🔄 Updating role from '${adminProfile.role}' to 'admin'...`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: 'admin' })
        .eq('email', adminEmail)
        .select();

      if (updateError) {
        console.error('❌ Error updating admin role:', updateError);
        return;
      }

      console.log('✅ Role updated successfully!');
      console.log('Updated profile:', updateData[0]);

    } else {
      console.log(`\n⚠️  Admin user not found in user_profiles. Creating profile...`);
      
      // Create admin profile
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: adminUser.id,
          user_id: adminUser.id,
          first_name: 'Admin',
          last_name: 'User',
          email: adminEmail,
          role: 'admin'
        })
        .select();

      if (insertError) {
        console.error('❌ Error creating admin profile:', insertError);
        return;
      }

      console.log('✅ Admin profile created with admin role!');
      console.log('New profile:', insertData[0]);
    }

    // Also update the auth user metadata to include the role
    console.log('\n🔄 Updating auth user metadata...');
    
    const { data: authUpdateData, error: authUpdateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          ...adminUser.user_metadata,
          role: 'admin'
        }
      }
    );

    if (authUpdateError) {
      console.error('❌ Error updating auth user metadata:', authUpdateError);
    } else {
      console.log('✅ Auth user metadata updated successfully!');
    }

    // Test login after fix
    console.log('\n🔐 Testing admin login after fix...');
    const { data: testLoginData, error: testLoginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'Admin123!'
    });

    if (testLoginError) {
      console.error('❌ Admin login test failed:', testLoginError.message);
    } else {
      console.log('✅ Admin login test successful!');
      console.log('Session user metadata:', testLoginData.user.user_metadata);
      
      // Logout
      await supabase.auth.signOut();
    }

    console.log('\n🎉 Admin role fix completed! User should now have admin access.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAndFixAdminUser();