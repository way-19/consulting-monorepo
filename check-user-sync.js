import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUserSync() {
  try {
    console.log('🔍 Checking user synchronization between user_profiles and auth.users...\n');

    // Get users from user_profiles
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role');

    if (profilesError) {
      console.error('❌ Error fetching user_profiles:', profilesError);
      return;
    }

    console.log(`📋 Found ${userProfiles.length} users in user_profiles:`);
    userProfiles.forEach(user => {
      console.log(`  - ${user.email} (${user.full_name}) - Role: ${user.role}`);
    });

    // Get users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching auth.users:', authError);
      return;
    }

    console.log(`\n🔐 Found ${authUsers.users.length} users in auth.users:`);
    authUsers.users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id}) - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    });

    // Check synchronization
    console.log('\n🔄 Synchronization check:');
    
    const profileEmails = new Set(userProfiles.map(u => u.email));
    const authEmails = new Set(authUsers.users.map(u => u.email));

    // Users in profiles but not in auth
    const missingInAuth = userProfiles.filter(u => !authEmails.has(u.email));
    if (missingInAuth.length > 0) {
      console.log('\n⚠️  Users in user_profiles but missing in auth.users:');
      missingInAuth.forEach(user => {
        console.log(`  - ${user.email} (${user.full_name})`);
      });
    }

    // Users in auth but not in profiles
    const missingInProfiles = authUsers.users.filter(u => !profileEmails.has(u.email));
    if (missingInProfiles.length > 0) {
      console.log('\n⚠️  Users in auth.users but missing in user_profiles:');
      missingInProfiles.forEach(user => {
        console.log(`  - ${user.email}`);
      });
    }

    if (missingInAuth.length === 0 && missingInProfiles.length === 0) {
      console.log('\n✅ All users are synchronized between both tables!');
    }

    // Test login for admin user
    console.log('\n🧪 Testing admin login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'Admin123!'
    });

    if (loginError) {
      console.error('❌ Admin login failed:', loginError.message);
    } else {
      console.log('✅ Admin login successful!');
      console.log(`   User ID: ${loginData.user.id}`);
      console.log(`   Email: ${loginData.user.email}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkUserSync();