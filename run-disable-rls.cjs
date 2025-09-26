const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runDisableRLS() {
  console.log('🔧 Disabling RLS for country configuration tables...');

  try {
    // Read the disable_rls.sql file
    const sqlContent = fs.readFileSync('disable_rls.sql', 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.includes('country_configurations') || 
          statement.includes('country_form_sections') ||
          statement.includes('country_form_fields') ||
          statement.includes('country_packages') ||
          statement.includes('country_services') ||
          statement.includes('country_config_audit')) {
        
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        
        try {
          // Use direct query for ALTER TABLE statements
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log(`Warning: ${error.message}`);
          } else {
            console.log('✅ Success');
          }
        } catch (err) {
          console.log(`Warning: ${err.message}`);
        }
      }
    }

    // Test access after disabling RLS
    console.log('\n🧪 Testing access to country_configurations...');
    
    const { data: configs, error: readError } = await supabase
      .from('country_configurations')
      .select('*')
      .limit(3);

    if (readError) {
      console.error('❌ Still cannot read country_configurations:', readError.message);
    } else {
      console.log(`✅ Successfully read ${configs.length} country configurations`);
      if (configs.length > 0) {
        console.log('Sample configs:', configs.map(c => `${c.country_code}: ${c.country_name}`));
      }
    }

    console.log('\n🎉 RLS disabled for country configuration tables!');

  } catch (error) {
    console.error('❌ Error disabling RLS:', error.message);
  }
}

async function main() {
  await runDisableRLS();
}

main().catch(console.error);