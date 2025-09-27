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
const anonKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Fixing admin profile...');

const supabase = createClient(supabaseUrl, anonKey);

async function fixAdminProfile() {
  try {
    // Update the new admin user to have admin role and correct email
    console.log('🔧 Updating admin.temp@consulting19.com to admin role...');
    const { error: updateTempError } = await supabase
      .from('user_profiles')
      .update({ 
        role: 'admin',
        email: 'admin@consulting19.com',
        full_name: 'System Administrator',
        display_name: 'Admin'
      })
      .eq('email', 'admin.temp@consulting19.com');
      
    if (updateTempError) {
      console.error('❌ Error updating temp admin:', updateTempError);
      return;
    }
    
    console.log('✅ Temp admin updated to admin role');
    
    // Delete the old admin profile that doesn't have a working auth user
    console.log('🗑️ Removing old admin profile...');
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('email', 'admin@consulting19.com')
      .neq('id', '55a26833-a58a-497a-b229-c166ca9c5bc1'); // Keep the new one
      
    if (deleteError) {
      console.error('❌ Error deleting old profile:', deleteError);
    } else {
      console.log('✅ Old admin profile removed');
    }
    
    // Test the login with admin@consulting19.com
    console.log('\n🔐 Testing login with admin@consulting19.com...');
    const { data: testLogin, error: testError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (testError) {
      console.error('❌ Login test failed:', testError.message);
      console.log('💡 Note: You may need to update the auth.users email as well');
    } else {
      console.log('✅ Login test successful!');
      console.log(`   User ID: ${testLogin.user.id}`);
      
      // Get the profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', testLogin.user.id)
        .single();
        
      if (profile) {
        console.log(`   Role: ${profile.role}`);
        console.log(`   Name: ${profile.full_name}`);
        console.log(`   Email: ${profile.email}`);
      }
      
      await supabase.auth.signOut();
    }
    
    // Show current state
    console.log('\n📋 Current user_profiles state:');
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('id, email, role, full_name')
      .order('email');
      
    if (allProfiles) {
      allProfiles.forEach(profile => {
        console.log(`   ${profile.email} (${profile.role}) - ID: ${profile.id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixAdminProfile();