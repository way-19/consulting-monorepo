// Bu script'i browser console'da çalıştırın
// Admin panel açıkken F12 > Console'da bu kodu çalıştırın

console.log('🔍 Checking country configurations in browser...\n');

// Check localStorage
const stored = localStorage.getItem('country_configurations');
if (stored) {
  try {
    const configs = JSON.parse(stored);
    console.log(`💾 LocalStorage has ${Object.keys(configs).length} configurations:`);
    
    Object.values(configs).forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName} - ${config.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}`);
    });
    
    const activeConfigs = Object.values(configs).filter(config => config.active);
    console.log(`\n✅ Active countries in localStorage: ${activeConfigs.length}`);
    
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
  }
} else {
  console.log('💾 No configurations in localStorage');
}

// Check if CountryConfigService is available
if (window.CountryConfigService) {
  const service = window.CountryConfigService.getInstance();
  const available = service.getAvailableCountries();
  console.log(`\n🌍 Available countries from service: ${available.length}`);
  available.forEach(config => {
    console.log(`  ${config.countryCode}: ${config.countryName}`);
  });
}