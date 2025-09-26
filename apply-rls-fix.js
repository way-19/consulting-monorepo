import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyRLSFix() {
  console.log('🔧 Applying RLS policy fixes...');
  
  try {
    // Read the SQL file
    const sqlContent = readFileSync('fix-country-config-rls.sql', 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`\n📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement using the rpc function
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\n${i + 1}. Executing: ${statement.substring(0, 60)}...`);
      
      try {
        // Use the SQL execution through a stored procedure
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
          // Continue with other statements
        } else {
          console.log(`   ✅ Success`);
        }
      } catch (e) {
        console.log(`   ❌ Exception: ${e.message}`);
        
        // Try alternative approach using a migration-like method
        try {
          // For DROP statements, we can try to ignore errors if policy doesn't exist
          if (statement.includes('DROP POLICY IF EXISTS')) {
            console.log(`   ℹ️  DROP statement - policy may not exist, continuing...`);
          } else {
            console.log(`   ⚠️  Will need manual execution in Supabase Studio`);
          }
        } catch (e2) {
          console.log(`   ❌ Alternative approach failed: ${e2.message}`);
        }
      }
    }
    
    console.log('\n🧪 Testing access after fixes...');
    
    // Test with anonymous client
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    const anonClient = createClient(supabaseUrl, anonKey);
    
    try {
      const { data: configs, error: configsError } = await anonClient
        .from('country_configurations')
        .select('id, country_code, is_active')
        .limit(5);
      
      if (configsError) {
        console.log(`   ❌ country_configurations access: ${configsError.message}`);
      } else {
        console.log(`   ✅ country_configurations access: ${configs.length} configs found`);
        configs.forEach(config => {
          console.log(`      - ${config.country_code}: ${config.is_active ? 'active' : 'inactive'}`);
        });
      }
    } catch (e) {
      console.log(`   ❌ country_configurations test failed: ${e.message}`);
    }
    
    // Test user_profiles access
    try {
      const { data: profiles, error: profilesError } = await anonClient
        .from('user_profiles')
        .select('id, role')
        .limit(5);
      
      if (profilesError) {
        console.log(`   ❌ user_profiles access: ${profilesError.message}`);
      } else {
        console.log(`   ✅ user_profiles access: ${profiles.length} profiles found`);
      }
    } catch (e) {
      console.log(`   ❌ user_profiles test failed: ${e.message}`);
    }
    
    console.log('\n🎉 RLS fix application completed!');
    
    if (statements.some(stmt => stmt.includes('CREATE POLICY'))) {
      console.log('\n📋 Next steps:');
      console.log('   1. If any statements failed, run them manually in Supabase Studio');
      console.log('   2. Open http://localhost:54323 and go to SQL Editor');
      console.log('   3. Copy and paste the failed statements from fix-country-config-rls.sql');
      console.log('   4. Re-run the test script to verify access');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

applyRLSFix();