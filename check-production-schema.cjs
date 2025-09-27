const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xtjzqjfnpxdcpyqpgzgb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anpxamZucHhkY3B5cXBnemdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzI5NzI1NywiZXhwIjoyMDQyODczMjU3fQ.8_gDUOLR2F1lEqJzqjjKqY7HVBqcb_H6nl_2zOGKBQs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking production database schema...\n');
  
  try {
    // Check user_profiles table structure using direct SQL
    console.log('📋 Checking user_profiles table structure:');
    const { data: userProfilesColumns, error: userProfilesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });
    
    if (userProfilesError) {
      console.error('❌ Error checking user_profiles:', userProfilesError);
      // Try alternative approach - just try to select from the table
      console.log('🔄 Trying alternative approach for user_profiles...');
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('❌ user_profiles test query error:', testError);
      } else {
        console.log('✅ user_profiles table exists and is accessible');
        if (testData && testData.length > 0) {
          console.log('📋 Sample row columns:', Object.keys(testData[0]));
        }
      }
    } else {
      console.log('✅ user_profiles columns:');
      userProfilesColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
    
    console.log('\n📋 Checking clients table structure:');
    const { data: clientsColumns, error: clientsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'clients' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });
    
    if (clientsError) {
      console.error('❌ Error checking clients:', clientsError);
      // Try alternative approach
      console.log('🔄 Trying alternative approach for clients...');
      const { data: testData, error: testError } = await supabase
        .from('clients')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('❌ clients test query error:', testError);
      } else {
        console.log('✅ clients table exists and is accessible');
        if (testData && testData.length > 0) {
          console.log('📋 Sample row columns:', Object.keys(testData[0]));
        }
      }
    } else {
      console.log('✅ clients columns:');
      clientsColumns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSchema();