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

console.log('🔍 Checking user_profiles table structure...');

const supabase = createClient(supabaseUrl, anonKey);

async function checkTableStructure() {
  try {
    // Get all records to see the structure
    console.log('📋 Fetching user_profiles data...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);
      
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }
    
    if (profiles && profiles.length > 0) {
      console.log('✅ Table structure (first record):');
      console.log(JSON.stringify(profiles[0], null, 2));
      
      console.log('\n📊 All available columns:');
      Object.keys(profiles[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof profiles[0][key]}`);
      });
      
      console.log('\n👥 All users in table:');
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.email} (${profile.role})`);
      });
    } else {
      console.log('❌ No profiles found');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkTableStructure();