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

console.log('🔧 Updating admin role...');

const supabase = createClient(supabaseUrl, anonKey);

async function updateAdminRole() {
  try {
    // Update the admin.temp@consulting19.com user to have admin role
    console.log('🔧 Setting admin role for admin.temp@consulting19.com...');
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        role: 'admin',
        full_name: 'System Administrator',
        display_name: 'Admin'
      })
      .eq('email', 'admin.temp@consulting19.com');
      
    if (updateError) {
      console.error('❌ Error updating admin role:', updateError);
      return;
    }
    
    console.log('✅ Admin role updated successfully');
    
    // Test the login
    console.log('\n🔐 Testing admin login...');
    const { data: testLogin, error: testError } = await supabase.auth.signInWithPassword({
      email: 'admin.temp@consulting19.com',
      password: 'admin123'
    });
    
    if (testError) {
      console.error('❌ Login test failed:', testError.message);
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
    
    // Show final state
    console.log('\n📋 Final user_profiles state:');
    const { data: allProfiles, error: allError } = await supabase
      .from('user_profiles')
      .select('id, email, role, full_name')
      .order('email');
      
    if (allProfiles) {
      allProfiles.forEach(profile => {
        console.log(`   ${profile.email} (${profile.role}) - ${profile.full_name || 'No name'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateAdminRole();