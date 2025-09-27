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

console.log('🔧 Creating admin user through SQL...');

const supabase = createClient(supabaseUrl, anonKey);

async function createAdminUserSQL() {
  try {
    // First, let's try to sign up the admin user
    console.log('📝 Attempting to sign up admin user...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@consulting19.com',
      password: 'admin123',
      options: {
        data: {
          role: 'admin'
        }
      }
    });
    
    if (signUpError) {
      console.log('⚠️ Sign up error (might already exist):', signUpError.message);
      
      // If user already exists, try to sign in
      console.log('🔐 Trying to sign in instead...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@consulting19.com',
        password: 'admin123'
      });
      
      if (signInError) {
        console.error('❌ Sign in failed:', signInError.message);
        
        // Let's check if we can reset the password
        console.log('🔄 Attempting password reset...');
        const { error: resetError } = await supabase.auth.resetPasswordForEmail('admin@consulting19.com');
        
        if (resetError) {
          console.error('❌ Password reset failed:', resetError.message);
        } else {
          console.log('✅ Password reset email sent (if user exists)');
        }
        
        return;
      } else {
        console.log('✅ Sign in successful!');
        console.log(`   User ID: ${signInData.user.id}`);
        console.log(`   Email: ${signInData.user.email}`);
        
        // Update the user_profiles table with the correct user_id
        console.log('🔧 Updating user_profiles with correct user_id...');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ user_id: signInData.user.id })
          .eq('email', 'admin@consulting19.com');
          
        if (updateError) {
          console.error('❌ Error updating profile:', updateError);
        } else {
          console.log('✅ Profile updated successfully');
        }
        
        await supabase.auth.signOut();
        return;
      }
    } else {
      console.log('✅ Sign up successful!');
      console.log(`   User ID: ${signUpData.user.id}`);
      console.log(`   Email: ${signUpData.user.email}`);
      console.log(`   Email confirmed: ${signUpData.user.email_confirmed_at ? 'Yes' : 'No'}`);
      
      // Update the user_profiles table with the correct user_id
      console.log('🔧 Updating user_profiles with correct user_id...');
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ user_id: signUpData.user.id })
        .eq('email', 'admin@consulting19.com');
        
      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
      } else {
        console.log('✅ Profile updated successfully');
      }
    }
    
    // Test the login
    console.log('\n🔐 Testing admin login...');
    const { data: testLogin, error: testError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
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
      }
      
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createAdminUserSQL();