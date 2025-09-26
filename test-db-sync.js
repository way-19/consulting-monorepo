import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (using local instance with service role)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseSync() {
  try {
    console.log('🔍 Testing database synchronization...');
    
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
        console.log(`  ${config.country_code}: ${config.country_name} - ${config.is_active ? 'ACTIVE' : 'INACTIVE'} (Updated: ${config.updated_at})`);
      });
    } else {
      console.log('  No configurations found in database');
    }

    // Check available countries first
    console.log('\n🌍 Checking available countries...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('code, name')
      .limit(5);

    if (countriesError) {
      console.error('❌ Error fetching countries:', countriesError);
    } else {
      console.log('Available countries:', countries?.map(c => `${c.code}: ${c.name}`).join(', '));
    }

    // Test inserting a new configuration using an existing country
    console.log('\n🧪 Testing insert/update functionality...');
    
    const testConfig = {
      country_code: 'US', // Using US as it's likely to exist
      country_name: 'United States (Test)',
      is_active: true,
      currency: 'USD',
      processing_time: '5-7 business days',
      minimum_capital: 1000,
      minimum_directors: 1,
      minimum_shareholders: 1,
      requires_local_address: false,
      requires_local_director: false,
      language: 'en',
      date_format: 'MM/DD/YYYY',
      time_zone: 'UTC',
      popularity: 0,
      description: 'Test country for database sync verification',
      benefits: ['Test benefit 1', 'Test benefit 2'],
      requirements: ['Test requirement 1', 'Test requirement 2']
    };

    const { data: insertData, error: insertError } = await supabase
      .from('country_configurations')
      .upsert(testConfig, { 
        onConflict: 'country_code',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      console.error('❌ Error inserting test configuration:', insertError);
    } else {
      console.log('✅ Test configuration inserted/updated successfully');
    }

    // Verify the insert
    const { data: verifyData, error: verifyError } = await supabase
      .from('country_configurations')
      .select('*')
      .eq('country_code', 'US')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying test configuration:', verifyError);
    } else {
      console.log('✅ Test configuration verified in database:', verifyData);
    }

    // Clean up test data
    const { error: deleteError } = await supabase
      .from('country_configurations')
      .delete()
      .eq('country_code', 'US');

    if (deleteError) {
      console.error('❌ Error cleaning up test configuration:', deleteError);
    } else {
      console.log('✅ Test configuration cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testDatabaseSync();