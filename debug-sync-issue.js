// Debug Sync Issue Script
// Bu script'i hem admin hem marketing app'te çalıştırın

console.log('🔍 SYNC DEBUG - App:', window.location.href);
console.log('🔍 Port:', window.location.port);

// 1. localStorage kontrolü
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
    
    console.log('\n📋 All Countries:');
    allCountries.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
  }
} else {
  console.log('❌ No country_configurations in localStorage');
}

// 2. CountryConfigService kontrolü
if (typeof CountryConfigService !== 'undefined') {
  console.log('\n🔧 CountryConfigService Test:');
  
  try {
    const service = CountryConfigService.getInstance();
    
    // Force reload
    service.reloadFromStorage();
    
    const allConfigs = service.getAllConfigurations();
    const availableConfigs = service.getAvailableCountries();
    
    console.log(`All configurations: ${allConfigs.length}`);
    console.log(`Available countries: ${availableConfigs.length}`);
    
    console.log('\n📋 Service - All Configurations:');
    allConfigs.forEach(config => {
      const status = config.active ? '🟢 ACTIVE' : '🔴 INACTIVE';
      console.log(`  ${config.countryCode}: ${config.countryName} - ${status}`);
    });
    
    console.log('\n✅ Service - Available Countries:');
    availableConfigs.forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName}`);
    });
    
  } catch (error) {
    console.error('❌ CountryConfigService Error:', error);
  }
} else {
  console.log('\n❌ CountryConfigService not available');
}

// 3. CrossDomainSync kontrolü
if (typeof CrossDomainSync !== 'undefined') {
  console.log('\n🔄 CrossDomainSync Test:');
  
  try {
    const sync = CrossDomainSync.getInstance();
    console.log('CrossDomainSync instance created');
    
    // Test broadcast
    sync.notifyCountryConfigUpdate({
      test: true,
      timestamp: Date.now(),
      source: window.location.port
    });
    
    console.log('Test broadcast sent');
    
  } catch (error) {
    console.error('❌ CrossDomainSync Error:', error);
  }
} else {
  console.log('\n❌ CrossDomainSync not available');
}

// 4. React component state kontrolü (sadece marketing app için)
if (window.location.port === '5173') {
  console.log('\n⚛️ React Component State Check:');
  
  setTimeout(() => {
    // DOM'da ülke elementlerini ara
    const countryCards = document.querySelectorAll('[data-country], .country-card, .glass-morphism');
    console.log(`Found ${countryCards.length} country elements in DOM`);
    
    // Aktif ülke sayısını say
    const activeCards = Array.from(countryCards).filter(card => 
      !card.classList.contains('glass-morphism-inactive') && 
      !card.textContent.includes('Coming Soon')
    );
    console.log(`Active country cards: ${activeCards.length}`);
    
    // Ülke isimlerini topla
    const countryNames = Array.from(countryCards).map(card => {
      const nameElement = card.querySelector('h3');
      return nameElement ? nameElement.textContent : 'Unknown';
    });
    console.log('Country names in DOM:', countryNames);
    
  }, 2000);
}

// 5. Storage event listener test
console.log('\n👂 Setting up storage event listener...');
window.addEventListener('storage', (event) => {
  if (event.key === 'country_configurations') {
    console.log('🔔 Storage event received!');
    console.log('Old value:', event.oldValue ? 'exists' : 'null');
    console.log('New value:', event.newValue ? 'exists' : 'null');
  }
});

// 6. Manual test functions
window.debugCountrySync = function() {
  console.log('\n🧪 Manual Country Sync Test...');
  
  if (typeof CountryConfigService !== 'undefined') {
    const service = CountryConfigService.getInstance();
    service.reloadFromStorage();
    
    const available = service.getAvailableCountries();
    console.log(`After reload - Available countries: ${available.length}`);
    
    // Trigger storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'country_configurations',
      newValue: localStorage.getItem('country_configurations'),
      oldValue: null
    }));
    
    console.log('✅ Manual storage event dispatched');
  }
};

window.testCrossDomainSync = function() {
  console.log('\n🧪 Manual CrossDomainSync Test...');
  
  if (typeof CrossDomainSync !== 'undefined') {
    const sync = CrossDomainSync.getInstance();
    sync.notifyCountryConfigUpdate({
      test: true,
      manualTest: true,
      timestamp: Date.now(),
      source: window.location.port
    });
    
    console.log('✅ Manual CrossDomainSync notification sent');
  }
};

console.log('\n🧪 Available Test Commands:');
console.log('debugCountrySync() - Test country synchronization');
console.log('testCrossDomainSync() - Test cross-domain sync');
console.log('location.reload() - Refresh page');