import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUserRole() {
  try {
    const targetEmail = 'giorgi.meskhi@consulting19.com';
    
    console.log(`🔍 Checking current role for ${targetEmail}...\n`);

    // First, get the user from auth.users to get their ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    const targetUser = authUsers.users.find(user => user.email === targetEmail);
    
    if (!targetUser) {
      console.error(`❌ User ${targetEmail} not found in auth.users`);
      return;
    }

    console.log(`✅ Found user in auth.users:`);
    console.log(`   ID: ${targetUser.id}`);
    console.log(`   Email: ${targetUser.email}`);
    console.log(`   Metadata:`, targetUser.user_metadata);

    // Check if user exists in user_profiles
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', targetEmail)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking user_profiles:', profileError);
      return;
    }

    if (userProfile) {
      console.log(`\n📋 Current user profile:`);
      console.log(`   ID: ${userProfile.id}`);
      console.log(`   Email: ${userProfile.email}`);
      console.log(`   Full Name: ${userProfile.full_name}`);
      console.log(`   Current Role: ${userProfile.role}`);

      if (userProfile.role === 'consultant') {
        console.log('\n✅ User already has consultant role!');
        return;
      }

      // Update the role to consultant
      console.log(`\n🔄 Updating role from '${userProfile.role}' to 'consultant'...`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: 'consultant' })
        .eq('email', targetEmail)
        .select();

      if (updateError) {
        console.error('❌ Error updating user role:', updateError);
        return;
      }

      console.log('✅ Role updated successfully!');
      console.log('Updated profile:', updateData[0]);

    } else {
      console.log(`\n⚠️  User not found in user_profiles. Creating profile...`);
      
      // Create user profile with consultant role
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: targetUser.id,
          user_id: targetUser.id,
          first_name: 'Giorgi',
          last_name: 'Meskhi',
          email: targetEmail,
          role: 'consultant'
        })
        .select();

      if (insertError) {
        console.error('❌ Error creating user profile:', insertError);
        return;
      }

      console.log('✅ User profile created with consultant role!');
      console.log('New profile:', insertData[0]);
    }

    // Also update the auth user metadata to include the role
    console.log('\n🔄 Updating auth user metadata...');
    
    const { data: authUpdateData, error: authUpdateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      {
        user_metadata: {
          ...targetUser.user_metadata,
          role: 'consultant'
        }
      }
    );

    if (authUpdateError) {
      console.error('❌ Error updating auth user metadata:', authUpdateError);
    } else {
      console.log('✅ Auth user metadata updated successfully!');
    }

    console.log('\n🎉 Role fix completed! User should now have consultant access.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixUserRole();