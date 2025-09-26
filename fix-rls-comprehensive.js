import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies comprehensively...');
  
  try {
    // 1. Drop all existing policies first
    console.log('\n1. Dropping existing policies...');
    
    const dropPolicies = [
      'DROP POLICY IF EXISTS "user_profiles_select_policy" ON user_profiles;',
      'DROP POLICY IF EXISTS "user_profiles_insert_policy" ON user_profiles;',
      'DROP POLICY IF EXISTS "user_profiles_update_policy" ON user_profiles;',
      'DROP POLICY IF EXISTS "country_configurations_select_policy" ON country_configurations;',
      'DROP POLICY IF EXISTS "country_configurations_insert_policy" ON country_configurations;',
      'DROP POLICY IF EXISTS "country_configurations_update_policy" ON country_configurations;',
      'DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;',
      'DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;',
      'DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;',
      'DROP POLICY IF EXISTS "Enable read access for all users" ON country_configurations;',
      'DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON country_configurations;',
      'DROP POLICY IF EXISTS "Enable update for authenticated users only" ON country_configurations;'
    ];
    
    for (const policy of dropPolicies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policy });
        if (error) {
          console.log(`   ⚠️ ${policy} - ${error.message}`);
        } else {
          console.log(`   ✅ ${policy}`);
        }
      } catch (e) {
        console.log(`   ⚠️ ${policy} - ${e.message}`);
      }
    }
    
    // 2. Enable RLS on tables
    console.log('\n2. Enabling RLS on tables...');
    
    const enableRLS = [
      'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE country_configurations ENABLE ROW LEVEL SECURITY;'
    ];
    
    for (const sql of enableRLS) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        if (error) {
          console.log(`   ❌ ${sql} - ${error.message}`);
        } else {
          console.log(`   ✅ ${sql}`);
        }
      } catch (e) {
        console.log(`   ❌ ${sql} - ${e.message}`);
      }
    }
    
    // 3. Create new comprehensive policies
    console.log('\n3. Creating new RLS policies...');
    
    const newPolicies = [
      // User profiles policies
      `CREATE POLICY "user_profiles_select_policy" ON user_profiles
       FOR SELECT USING (true);`,
       
      `CREATE POLICY "user_profiles_insert_policy" ON user_profiles
       FOR INSERT WITH CHECK (auth.uid() = id);`,
       
      `CREATE POLICY "user_profiles_update_policy" ON user_profiles
       FOR UPDATE USING (auth.uid() = id);`,
       
      // Country configurations policies
      `CREATE POLICY "country_configurations_select_policy" ON country_configurations
       FOR SELECT USING (true);`,
       
      `CREATE POLICY "country_configurations_insert_policy" ON country_configurations
       FOR INSERT WITH CHECK (
         EXISTS (
           SELECT 1 FROM user_profiles 
           WHERE id = auth.uid() 
           AND role IN ('admin', 'consultant')
         )
       );`,
       
      `CREATE POLICY "country_configurations_update_policy" ON country_configurations
       FOR UPDATE USING (
         EXISTS (
           SELECT 1 FROM user_profiles 
           WHERE id = auth.uid() 
           AND role IN ('admin', 'consultant')
         )
       );`
    ];
    
    for (const policy of newPolicies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policy });
        if (error) {
          console.log(`   ❌ Policy creation failed: ${error.message}`);
        } else {
          console.log(`   ✅ Policy created successfully`);
        }
      } catch (e) {
        console.log(`   ❌ Policy creation failed: ${e.message}`);
      }
    }
    
    // 4. Test access with anon client
    console.log('\n4. Testing access with anon client...');
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    const anonClient = createClient(supabaseUrl, anonKey);
    
    try {
      const { data: profiles, error: profilesError } = await anonClient
        .from('user_profiles')
        .select('*');
      
      if (profilesError) {
        console.log(`   ❌ user_profiles access: ${profilesError.message}`);
      } else {
        console.log(`   ✅ user_profiles access: ${profiles.length} profiles`);
      }
    } catch (e) {
      console.log(`   ❌ user_profiles access: ${e.message}`);
    }
    
    try {
      const { data: configs, error: configsError } = await anonClient
        .from('country_configurations')
        .select('*');
      
      if (configsError) {
        console.log(`   ❌ country_configurations access: ${configsError.message}`);
      } else {
        console.log(`   ✅ country_configurations access: ${configs.length} configs`);
      }
    } catch (e) {
      console.log(`   ❌ country_configurations access: ${e.message}`);
    }
    
    console.log('\n🎉 RLS policy fix completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Create exec_sql function if it doesn't exist
async function createExecSqlFunction() {
  const createFunction = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createFunction });
    if (error) {
      console.log('Creating exec_sql function...');
      // Try direct SQL execution
      const { error: directError } = await supabase
        .from('_dummy_table_that_does_not_exist')
        .select('*');
      // This will fail but we can use the connection
    }
  } catch (e) {
    // Function might not exist yet, that's ok
  }
}

createExecSqlFunction().then(() => fixRLSPolicies());