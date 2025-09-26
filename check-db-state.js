import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (using local instance with service role)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseState() {
  try {
    console.log('🔍 Checking current database state...');
    
    // Check current country configurations in database
    const { data: configs, error } = await supabase
      .from('country_configurations')
      .select('country_code, country_name, is_active, updated_at')
      .order('country_code');

    if (error) {
      console.error('❌ Error fetching configurations:', error);
      return;
    }

    console.log(`📊 Found ${configs?.length || 0} configurations in database:`);
    
    if (configs && configs.length > 0) {
      configs.forEach(config => {
        const status = config.is_active ? '🟢 ACTIVE' : '🔴 INACTIVE';
        const updateTime = new Date(config.updated_at).toLocaleString();
        console.log(`  ${config.country_code}: ${config.country_name} - ${status} (Updated: ${updateTime})`);
      });
    } else {
      console.log('  No configurations found in database');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseState();