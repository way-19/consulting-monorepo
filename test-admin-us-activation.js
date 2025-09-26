// Admin panelinde US ülkesinin varlığını ve aktivasyonunu test eden script
// Admin panel browser console'da çalıştırın

console.log('🔍 Testing US country activation in admin panel...\n');

// 1. Check if CountryConfigService is available
const configService = window.CountryConfigService?.getInstance();
if (!configService) {
  console.error('❌ CountryConfigService not found!');
} else {
  console.log('✅ CountryConfigService found');
}

// 2. Get all countries from memory
console.log('\n📊 All countries in memory:');
const allCountries = configService.getAllConfigurations();
console.log(`Total countries: ${allCountries.length}`);

allCountries.forEach(country => {
  console.log(`  ${country.countryCode}: ${country.countryName} - ${country.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}`);
});

// 3. Check specifically for US
const usCountry = configService.getCountryConfig('US');
if (usCountry) {
  console.log('\n🇺🇸 US Country found:');
  console.log('  Code:', usCountry.countryCode);
  console.log('  Name:', usCountry.countryName);
  console.log('  Active:', usCountry.active ? '🟢 YES' : '🔴 NO');
  console.log('  Full config:', usCountry);
} else {
  console.log('\n❌ US Country NOT found in memory!');
}

// 4. Check localStorage directly
console.log('\n💾 Checking localStorage directly:');
const stored = localStorage.getItem('country_configurations');
if (stored) {
  try {
    const configs = JSON.parse(stored);
    if (configs.US) {
      console.log('✅ US found in localStorage:');
      console.log('  Active:', configs.US.active ? '🟢 YES' : '🔴 NO');
    } else {
      console.log('❌ US NOT found in localStorage!');
      console.log('Available countries in localStorage:', Object.keys(configs));
    }
  } catch (e) {
    console.error('❌ Error parsing localStorage:', e);
  }
} else {
  console.log('❌ No country_configurations in localStorage!');
}

// 5. Test function to activate US
window.testActivateUS = async function() {
  console.log('\n🔧 Testing US activation...');
  
  if (!usCountry) {
    console.error('❌ Cannot activate US - country not found!');
    return;
  }
  
  try {
    console.log('Before activation:', usCountry.active);
    
    // Create updated country with active = true
    const updatedCountry = { ...usCountry, active: true };
    console.log('Updated country object:', updatedCountry);
    
    // Save configuration
    console.log('Calling saveConfiguration...');
    await configService.saveConfiguration(updatedCountry);
    console.log('✅ saveConfiguration completed');
    
    // Check if it was saved
    const afterSave = configService.getCountryConfig('US');
    console.log('After save - US active:', afterSave?.active);
    
    // Check localStorage
    const storedAfter = localStorage.getItem('country_configurations');
    if (storedAfter) {
      const configsAfter = JSON.parse(storedAfter);
      console.log('After save - localStorage US active:', configsAfter.US?.active);
    }
    
  } catch (error) {
    console.error('❌ Error during activation:', error);
  }
};

console.log('\n🧪 Test function created: testActivateUS()');
console.log('Run testActivateUS() to test US activation');