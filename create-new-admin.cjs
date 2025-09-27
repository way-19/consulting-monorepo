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

console.log('🔧 Creating new admin user...');

const supabase = createClient(supabaseUrl, anonKey);

async function createNewAdmin() {
  try {
    // Create a new admin user with a temporary email
    const tempEmail = 'admin.temp@consulting19.com';
    console.log(`📝 Creating new admin user: ${tempEmail}`);
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: tempEmail,
      password: 'admin123',
      options: {
        data: {
          role: 'admin'
        }
      }
    });
    
    if (signUpError) {
      console.error('❌ Sign up failed:', signUpError.message);
      return;
    }
    
    console.log('✅ New admin user created!');
    console.log(`   User ID: ${signUpData.user.id}`);
    console.log(`   Email: ${signUpData.user.email}`);
    
    // Now update the existing admin profile to use this new user_id
    console.log('🔧 Updating existing admin profile...');
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        user_id: signUpData.user.id,
        email: tempEmail  // Update email to match
      })
      .eq('email', 'admin@consulting19.com');
      
    if (updateError) {
      console.error('❌ Error updating profile:', updateError);
      return;
    }
    
    console.log('✅ Profile updated successfully');
    
    // Test the login with the new email
    console.log('\n🔐 Testing login with new admin user...');
    const { data: testLogin, error: testError } = await supabase.auth.signInWithPassword({
      email: tempEmail,
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
        .eq('user_id', testLogin.user.id)
        .single();
        
      if (profile) {
        console.log(`   Role: ${profile.role}`);
        console.log(`   Name: ${profile.name}`);
        console.log(`   Email: ${profile.email}`);
      }
      
      await supabase.auth.signOut();
      
      console.log('\n💡 Solution:');
      console.log(`   Update the admin login page to use: ${tempEmail}`);
      console.log('   Password: admin123');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createNewAdmin();