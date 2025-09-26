import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUserProfilesDirect() {
  try {
    console.log('🔍 Checking user_profiles table directly...\n');

    // Try different approaches to query user_profiles
    console.log('1️⃣ Using .from() method:');
    const { data: profiles1, error: error1 } = await supabase
      .from('user_profiles')
      .select('*');

    if (error1) {
      console.error('❌ Error with .from() method:', error1);
    } else {
      console.log(`✅ Found ${profiles1.length} users with .from() method`);
      profiles1.forEach(user => {
        console.log(`  - ${user.email} (${user.full_name}) - Role: ${user.role}`);
      });
    }

    console.log('\n2️⃣ Using raw SQL query:');
    const { data: profiles2, error: error2 } = await supabase
      .rpc('exec_sql', { sql: 'SELECT * FROM user_profiles' });

    if (error2) {
      console.error('❌ Error with raw SQL:', error2);
    } else {
      console.log(`✅ Found ${profiles2?.length || 0} users with raw SQL`);
    }

    console.log('\n3️⃣ Checking table existence:');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_profiles');

    if (tablesError) {
      console.error('❌ Error checking table existence:', tablesError);
    } else {
      console.log(`✅ Table exists: ${tables.length > 0 ? 'Yes' : 'No'}`);
    }

    console.log('\n4️⃣ Listing all public tables:');
    const { data: allTables, error: allTablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (allTablesError) {
      console.error('❌ Error listing tables:', allTablesError);
    } else {
      console.log('📋 Available tables:');
      allTables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkUserProfilesDirect();