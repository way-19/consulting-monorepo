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

console.log('🔧 Force updating admin role...');

const supabase = createClient(supabaseUrl, anonKey);

async function forceAdminRole() {
  try {
    // First sign in as the admin user
    console.log('🔐 Signing in as admin.temp@consulting19.com...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin.temp@consulting19.com',
      password: 'admin123'
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      return;
    }
    
    console.log('✅ Signed in successfully');
    console.log(`   User ID: ${loginData.user.id}`);
    
    // Now try to update the profile while authenticated
    console.log('🔧 Updating profile while authenticated...');
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        role: 'admin',
        full_name: 'System Administrator',
        display_name: 'Admin'
      })
      .eq('id', loginData.user.id);
      
    if (updateError) {
      console.error('❌ Error updating profile:', updateError);
    } else {
      console.log('✅ Profile updated successfully');
    }
    
    // Verify the update
    console.log('🔍 Verifying the update...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();
      
    if (profile) {
      console.log(`   Role: ${profile.role}`);
      console.log(`   Name: ${profile.full_name}`);
      console.log(`   Email: ${profile.email}`);
    }
    
    await supabase.auth.signOut();
    
    // Test login again to make sure everything works
    console.log('\n🔐 Final login test...');
    const { data: finalTest, error: finalError } = await supabase.auth.signInWithPassword({
      email: 'admin.temp@consulting19.com',
      password: 'admin123'
    });
    
    if (finalError) {
      console.error('❌ Final test failed:', finalError.message);
    } else {
      console.log('✅ Final test successful!');
      
      const { data: finalProfile, error: finalProfileError } = await supabase
        .from('user_profiles')
        .select('role, full_name, email')
        .eq('id', finalTest.user.id)
        .single();
        
      if (finalProfile) {
        console.log(`   Final Role: ${finalProfile.role}`);
        console.log(`   Final Name: ${finalProfile.full_name}`);
      }
      
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

forceAdminRole();