const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4anFqcWpxanFqcWpxanFqcWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzU2NzY5NCwiZXhwIjoyMDUzMTQzNjk0fQ.example';

async function checkCountryConfigurations() {
  console.log('🔍 Checking country configurations from database...\n');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check country_configurations table
    const { data: countries, error } = await supabase
      .from('country_configurations')
      .select('*')
      .order('country_code');
    
    if (error) {
      console.error('❌ Error fetching countries:', error);
      return;
    }
    
    console.log('📊 Country Configurations:');
    console.log('Total countries:', countries.length);
    console.log('');
    
    countries.forEach(country => {
      console.log(`🏳️  ${country.country_code} - ${country.country_name}`);
      console.log(`   Active: ${country.is_active ? '✅' : '❌'}`);
      console.log(`   Order Form Enabled: ${country.order_form_enabled ? '✅' : '❌'}`);
      console.log(`   Created: ${new Date(country.created_at).toLocaleDateString()}`);
      console.log('');
    });
    
    // Summary
    const activeCountries = countries.filter(c => c.is_active);
    const orderFormEnabledCountries = countries.filter(c => c.order_form_enabled);
    
    console.log('📈 Summary:');
    console.log(`Total countries: ${countries.length}`);
    console.log(`Active countries: ${activeCountries.length}`);
    console.log(`Order form enabled countries: ${orderFormEnabledCountries.length}`);
    console.log('');
    
    console.log('🔍 Active countries:');
    activeCountries.forEach(c => console.log(`   - ${c.country_code}: ${c.country_name}`));
    console.log('');
    
    console.log('📝 Order form enabled countries:');
    orderFormEnabledCountries.forEach(c => console.log(`   - ${c.country_code}: ${c.country_name}`));
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkCountryConfigurations();