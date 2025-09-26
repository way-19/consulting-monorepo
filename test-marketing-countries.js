// Marketing App Country Debug Script
// Bu script'i marketing app'te (http://localhost:5173) browser console'da çalıştırın

console.log('🛒 MARKETING APP - Country Debug');
console.log('📍 URL:', window.location.href);

// 1. Check localStorage
const stored = localStorage.getItem('country_configurations');
console.log('\n💾 localStorage Raw Data:');
console.log(stored);

if (stored) {
  try {
    const configs = JSON.parse(stored);
    const allCountries = Object.values(configs);
    const activeCountries = allCountries.filter(config => config.active);
    
    console.log('\n📊 localStorage Analysis:');
    console.log(`Total countries: ${allCountries.length}`);
    console.log(`Active countries: ${activeCountries.length}`);
    
    console.log('\n📋 All Countries in localStorage:');
    allCountries.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
    console.log('\n✅ Active Countries Only:');
    activeCountries.forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName}`);
    });
    
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
  }
}

// 2. Test CountryConfigService
if (typeof CountryConfigService !== 'undefined') {
  console.log('\n🔧 Testing CountryConfigService...');
  
  try {
    const service = CountryConfigService.getInstance();
    
    // Force reload
    service.reloadFromStorage();
    
    const allConfigs = service.getAllConfigurations();
    const availableConfigs = service.getAvailableCountries();
    
    console.log('\n🌍 CountryConfigService Results:');
    console.log(`All configurations: ${allConfigs.length}`);
    console.log(`Available countries: ${availableConfigs.length}`);
    
    console.log('\n📋 All Configurations:');
    allConfigs.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
    console.log('\n✅ Available Countries (getAvailableCountries):');
    availableConfigs.forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName}`);
    });
    
  } catch (error) {
    console.error('❌ CountryConfigService Error:', error);
  }
} else {
  console.log('\n❌ CountryConfigService not available');
}

// 3. Check if we're on the company formation page
if (window.location.pathname.includes('company-formation')) {
  console.log('\n🏢 Company Formation Page Detected');
  
  // Try to find React component state
  setTimeout(() => {
    // Look for country selection elements
    const countryElements = document.querySelectorAll('[data-country], .country-card, .country-option');
    console.log(`Found ${countryElements.length} country elements in DOM`);
    
    if (countryElements.length > 0) {
      console.log('Country elements found:', countryElements);
    }
    
    // Check for any error messages
    const errorElements = document.querySelectorAll('.error, .alert-error, [class*="error"]');
    if (errorElements.length > 0) {
      console.log('Error elements found:', errorElements);
    }
  }, 1000);
}

// 4. Manual test function
window.testCountryReload = function() {
  console.log('\n🔄 Manual Country Reload Test...');
  
  if (typeof CountryConfigService !== 'undefined') {
    const service = CountryConfigService.getInstance();
    service.reloadFromStorage();
    
    const available = service.getAvailableCountries();
    console.log(`Reloaded - Available countries: ${available.length}`);
    available.forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName}`);
    });
    
    // Trigger a storage event to simulate cross-domain update
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'country_configurations',
      newValue: localStorage.getItem('country_configurations'),
      oldValue: null
    }));
    
    console.log('✅ Storage event dispatched');
  }
};

console.log('\n🧪 Test Commands:');
console.log('testCountryReload() - Manually reload countries');
console.log('location.reload() - Refresh page');