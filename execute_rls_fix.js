const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeRLSFix() {
  try {
    console.log('🔧 Starting comprehensive RLS fix...');
    
    // Read the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'fix_all_rls.sql'), 'utf8');
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.includes('SELECT')) {
        // For SELECT statements, we want to see the results
        console.log(`\n🔍 Executing query ${i + 1}/${statements.length}:`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
        } else {
          console.log(`✅ Query ${i + 1} result:`, data);
        }
      } else {
        // For other statements (ALTER, DROP, GRANT, etc.)
        console.log(`\n⚙️ Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
      
      // Small delay between statements
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 RLS fix completed!');
    
    // Test database access
    console.log('\n🧪 Testing database access...');
    const { data: testData, error: testError } = await supabase
      .from('country_configurations')
      .select('country_code, country_name, is_active')
      .limit(5);
    
    if (testError) {
      console.error('❌ Test failed:', testError);
    } else {
      console.log('✅ Test successful! Sample data:', testData);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Create exec_sql function if it doesn't exist
async function createExecSqlFunction() {
  console.log('🔧 Creating exec_sql function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
        result json;
    BEGIN
        EXECUTE sql;
        GET DIAGNOSTICS result = ROW_COUNT;
        RETURN json_build_object('rows_affected', result);
    EXCEPTION
        WHEN OTHERS THEN
            RETURN json_build_object('error', SQLERRM);
    END;
    $$;
  `;
  
  const { error } = await supabase.rpc('exec', { sql: createFunctionSQL });
  if (error) {
    console.log('ℹ️ exec_sql function may already exist or creation failed:', error.message);
  } else {
    console.log('✅ exec_sql function created successfully');
  }
}

// Main execution
async function main() {
  await createExecSqlFunction();
  await executeRLSFix();
}

main().catch(console.error);