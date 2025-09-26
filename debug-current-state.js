// Bu script'i hem admin hem marketing app'te browser console'da çalıştırın
console.log('🔍 DEBUGGING CURRENT STATE');
console.log('📍 URL:', window.location.href);
console.log('📍 Port:', window.location.port);

// 1. Check localStorage
const stored = localStorage.getItem('country_configurations');
console.log('\n💾 RAW localStorage data:');
console.log(stored);

if (stored) {
  try {
    const configs = JSON.parse(stored);
    console.log('\n📊 PARSED localStorage configurations:');
    
    const allCountries = Object.values(configs);
    const activeCountries = allCountries.filter(config => config.active);
    
    console.log(`Total countries: ${allCountries.length}`);
    console.log(`Active countries: ${activeCountries.length}`);
    
    console.log('\n📋 ALL COUNTRIES:');
    allCountries.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
    console.log('\n✅ ACTIVE COUNTRIES ONLY:');
    activeCountries.forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName}`);
    });
    
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
  }
}

// 2. Check CountryConfigService if available
if (typeof CountryConfigService !== 'undefined') {
  console.log('\n🔧 TESTING CountryConfigService...');
  
  try {
    const service = CountryConfigService.getInstance();
    
    // Force reload
    service.reloadFromStorage();
    
    const allConfigs = service.getAllConfigurations();
    const availableConfigs = service.getAvailableCountries();
    
    console.log(`Service - All configurations: ${allConfigs.length}`);
    console.log(`Service - Available countries: ${availableConfigs.length}`);
    
    console.log('\n🌍 SERVICE - All configurations:');
    allConfigs.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
    console.log('\n✅ SERVICE - Available countries:');
    availableConfigs.forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName}`);
    });
    
  } catch (error) {
    console.error('❌ Error with CountryConfigService:', error);
  }
} else {
  console.log('\n❌ CountryConfigService not available in this context');
}

// 3. Check if we're in marketing app and check useOrderForm
if (window.location.port === '5173') {
  console.log('\n🛒 MARKETING APP - Checking order form state...');
  
  // Try to access React DevTools or any global state
  if (window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React detected - check React DevTools for component state');
  }
}

console.log('\n🔄 To refresh data manually, run: location.reload()');