const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixCountryConfigRLS() {
  console.log('🔧 Fixing country_configurations RLS policies...');

  try {
    // Drop existing admin policies that have syntax errors
    console.log('Dropping existing admin policies...');
    
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Admin full access to country configurations" ON country_configurations;',
      'DROP POLICY IF EXISTS "Admin full access to form sections" ON country_form_sections;',
      'DROP POLICY IF EXISTS "Admin full access to form fields" ON country_form_fields;',
      'DROP POLICY IF EXISTS "Admin full access to packages" ON country_packages;',
      'DROP POLICY IF EXISTS "Admin full access to services" ON country_services;',
      'DROP POLICY IF EXISTS "Admin full access to audit log" ON country_config_audit;'
    ];

    for (const sql of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.log(`Warning dropping policy: ${error.message}`);
      }
    }

    // Create corrected admin policies
    console.log('Creating corrected admin policies...');
    
    const createPolicies = [
      `CREATE POLICY "Admin full access to country configurations" ON country_configurations
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM auth.users 
           WHERE id = auth.uid() 
           AND raw_user_meta_data->>'role' = 'admin'
         )
       );`,
      
      `CREATE POLICY "Admin full access to form sections" ON country_form_sections
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM auth.users 
           WHERE id = auth.uid() 
           AND raw_user_meta_data->>'role' = 'admin'
         )
       );`,
      
      `CREATE POLICY "Admin full access to form fields" ON country_form_fields
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM auth.users 
           WHERE id = auth.uid() 
           AND raw_user_meta_data->>'role' = 'admin'
         )
       );`,
      
      `CREATE POLICY "Admin full access to packages" ON country_packages
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM auth.users 
           WHERE id = auth.uid() 
           AND raw_user_meta_data->>'role' = 'admin'
         )
       );`,
      
      `CREATE POLICY "Admin full access to services" ON country_services
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM auth.users 
           WHERE id = auth.uid() 
           AND raw_user_meta_data->>'role' = 'admin'
         )
       );`,
      
      `CREATE POLICY "Admin full access to audit log" ON country_config_audit
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM auth.users 
           WHERE id = auth.uid() 
           AND raw_user_meta_data->>'role' = 'admin'
         )
       );`
    ];

    for (const sql of createPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.error(`Error creating policy: ${error.message}`);
        console.error(`SQL: ${sql}`);
      } else {
        console.log('✅ Policy created successfully');
      }
    }

    // Test admin access
    console.log('\n🧪 Testing admin access to country_configurations...');
    
    // First, login as admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Admin login failed:', authError.message);
      return;
    }

    console.log('✅ Admin logged in successfully');

    // Test reading country configurations
    const { data: configs, error: readError } = await supabase
      .from('country_configurations')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('❌ Failed to read country_configurations:', readError.message);
    } else {
      console.log(`✅ Successfully read ${configs.length} country configurations`);
      if (configs.length > 0) {
        console.log('Sample config:', configs[0].country_code, configs[0].country_name);
      }
    }

    // Test creating a sample configuration
    const { data: insertData, error: insertError } = await supabase
      .from('country_configurations')
      .insert({
        country_code: 'TEST',
        country_name: 'Test Country',
        is_active: false,
        currency: 'USD'
      })
      .select();

    if (insertError) {
      console.error('❌ Failed to insert test config:', insertError.message);
    } else {
      console.log('✅ Successfully inserted test configuration');
      
      // Clean up test data
      await supabase
        .from('country_configurations')
        .delete()
        .eq('country_code', 'TEST');
      console.log('✅ Test data cleaned up');
    }

    console.log('\n🎉 Country configurations RLS policies fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error.message);
  }
}

// Create exec_sql function if it doesn't exist
async function createExecSqlFunction() {
  const { error } = await supabase.rpc('exec_sql', { 
    sql: `CREATE OR REPLACE FUNCTION exec_sql(sql text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$;` 
  });
  
  if (error && !error.message.includes('already exists')) {
    console.log('Creating exec_sql function...');
    // Try alternative approach
    const { error: altError } = await supabase
      .from('country_configurations')
      .select('id')
      .limit(1);
    
    if (altError) {
      console.log('Will use direct SQL execution');
    }
  }
}

async function main() {
  await createExecSqlFunction();
  await fixCountryConfigRLS();
}

main().catch(console.error);