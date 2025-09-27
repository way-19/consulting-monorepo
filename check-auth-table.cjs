const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking admin user in auth table...');
console.log('📧 Looking for: admin@consulting19.com');

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAndCreateAdminUser() {
  try {
    // Check if user exists in auth.users
    console.log('\n📋 Checking auth.users table...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error listing auth users:', authError);
      return;
    }

    const adminUser = authUsers.users.find(user => user.email === 'admin@consulting19.com');
    
    if (adminUser) {
      console.log('✅ Admin user found in auth.users:');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Email confirmed: ${adminUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Created: ${adminUser.created_at}`);
    } else {
      console.log('❌ Admin user NOT found in auth.users');
      console.log('\n🔧 Creating admin user...');
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'admin@consulting19.com',
        password: 'admin123',
        email_confirm: true
      });
      
      if (createError) {
        console.error('❌ Error creating admin user:', createError);
        return;
      }
      
      console.log('✅ Admin user created successfully:');
      console.log(`   ID: ${newUser.user.id}`);
      console.log(`   Email: ${newUser.user.email}`);
      
      // Now check if profile exists and update user_id if needed
      console.log('\n🔍 Checking user_profiles table...');
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'admin@consulting19.com')
        .single();
        
      if (profile && !profile.user_id) {
        console.log('🔧 Updating profile with new user_id...');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ user_id: newUser.user.id })
          .eq('email', 'admin@consulting19.com');
          
        if (updateError) {
          console.error('❌ Error updating profile:', updateError);
        } else {
          console.log('✅ Profile updated with user_id');
        }
      }
    }
    
    // Test login
    console.log('\n🔐 Testing admin login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError);
    } else {
      console.log('✅ Login test successful!');
      console.log(`   User ID: ${loginData.user.id}`);
      
      // Sign out
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAndCreateAdminUser();