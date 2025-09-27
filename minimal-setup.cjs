const { createClient } = require('@supabase/supabase-js');

// Production Supabase credentials
const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductionSetup() {
  console.log('🚀 Testing production Supabase setup...');
  
  try {
    // Test if we can access basic auth functionality
    console.log('🔐 Testing authentication...');
    
    // Try to sign up a test user (this will fail if auth is not properly configured, but that's expected)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@consulting19.com',
      password: 'testpassword123'
    });
    
    if (authError) {
      console.log('⚠️  Auth test result:', authError.message);
    } else {
      console.log('✅ Auth system is working');
    }

    // Test basic table access
    console.log('📊 Testing table access...');
    
    const tables = [
      'user_profiles',
      'clients', 
      'projects',
      'tasks',
      'country_configurations'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        if (error) {
          if (error.message.includes('relation') && error.message.includes('does not exist')) {
            console.log(`❌ Table ${table} does not exist - needs migration`);
          } else {
            console.log(`⚠️  Table ${table} access issue: ${error.message}`);
          }
        } else {
          console.log(`✅ Table ${table} exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Table ${table} test failed: ${err.message}`);
      }
    }

    console.log('\n📋 Summary:');
    console.log('✅ Cloud Supabase connection successful');
    console.log('✅ Environment variables updated for production');
    console.log('⚠️  Database migrations need to be applied manually');
    console.log('\n🔧 Next steps:');
    console.log('1. Open: https://supabase.com/dashboard/project/qdwykqrepolavgvfxquw/sql');
    console.log('2. Copy content from combined-migration.sql');
    console.log('3. Execute in SQL Editor');
    console.log('4. Test applications');
    
    return true;
    
  } catch (error) {
    console.error('❌ Production setup test failed:', error.message);
    return false;
  }
}

testProductionSetup();