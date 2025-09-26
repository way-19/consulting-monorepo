// Bu script'i browser console'da çalıştırın
// Hem admin panel hem de marketing app'te test edin

console.log('🔍 Testing Country Synchronization\n');
console.log('📍 Current URL:', window.location.href);
console.log('📍 Current Port:', window.location.port);

// Check localStorage
const stored = localStorage.getItem('country_configurations');
if (stored) {
  try {
    const configs = JSON.parse(stored);
    console.log('\n💾 LocalStorage Configurations:');
    
    const allCountries = Object.values(configs);
    const activeCountries = allCountries.filter(config => config.active);
    
    console.log(`📊 Total countries: ${allCountries.length}`);
    console.log(`✅ Active countries: ${activeCountries.length}`);
    console.log(`❌ Inactive countries: ${allCountries.length - activeCountries.length}`);
    
    console.log('\n📋 Country Details:');
    allCountries.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
    // Test CountryConfigService if available
    if (typeof CountryConfigService !== 'undefined') {
      console.log('\n🔧 Testing CountryConfigService...');
      const service = CountryConfigService.getInstance();
      
      // Force reload from localStorage
      service.reloadFromStorage();
      
      const availableCountries = service.getAvailableCountries();
      console.log(`🌍 Available countries from service: ${availableCountries.length}`);
      
      availableCountries.forEach(config => {
        console.log(`  ${config.countryCode}: ${config.countryName}`);
      });
      
      // Check if there's a mismatch
      if (availableCountries.length !== activeCountries.length) {
        console.warn('⚠️ MISMATCH DETECTED!');
        console.warn(`LocalStorage active: ${activeCountries.length}, Service available: ${availableCountries.length}`);
      } else {
        console.log('✅ LocalStorage and Service are in sync!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
  }
} else {
  console.log('💾 No configurations found in localStorage');
}

// Test function to toggle a country (for testing)
window.testToggleCountry = function(countryCode) {
  console.log(`🔧 Testing toggle for ${countryCode}...`);
  
  const stored = localStorage.getItem('country_configurations');
  if (stored) {
    const configs = JSON.parse(stored);
    if (configs[countryCode]) {
      configs[countryCode].active = !configs[countryCode].active;
      localStorage.setItem('country_configurations', JSON.stringify(configs));
      
      // Trigger storage event manually for same-tab testing
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'country_configurations',
        newValue: JSON.stringify(configs),
        oldValue: stored
      }));
      
      console.log(`✅ ${countryCode} toggled to: ${configs[countryCode].active ? 'ACTIVE' : 'INACTIVE'}`);
      console.log('🔄 Storage event dispatched');
    } else {
      console.error(`❌ Country ${countryCode} not found`);
    }
  }
};

console.log('\n🧪 Test Commands Available:');
console.log('testToggleCountry("GE") - Toggle Georgia');
console.log('testToggleCountry("CR") - Toggle Costa Rica');
console.log('testToggleCountry("AE") - Toggle UAE');