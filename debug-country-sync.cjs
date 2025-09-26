// Debug script to check country synchronization
console.log('🔍 Debugging Country Synchronization...\n');

// Simulate localStorage access
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  }
};

// Mock the CountryConfigService behavior
class MockCountryConfigService {
  constructor() {
    this.configurations = new Map();
    this.initializeDefaultConfigurations();
    this.loadFromStorage();
  }

  initializeDefaultConfigurations() {
    // Georgia Configuration
    this.configurations.set('GE', {
      countryCode: 'GE',
      countryName: 'Georgia',
      active: true,
      basePrice: 1200,
      timeframe: '5-7 days',
      currency: 'USD'
    });

    // Costa Rica Configuration
    this.configurations.set('CR', {
      countryCode: 'CR',
      countryName: 'Costa Rica',
      active: true,
      basePrice: 1500,
      timeframe: '7-10 days',
      currency: 'USD'
    });

    // UAE Configuration
    this.configurations.set('AE', {
      countryCode: 'AE',
      countryName: 'United Arab Emirates',
      active: true,
      basePrice: 2000,
      timeframe: '10-14 days',
      currency: 'USD'
    });

    console.log('✅ Default configurations initialized');
    console.log('Countries in memory:', Array.from(this.configurations.keys()));
  }

  loadFromStorage() {
    try {
      const stored = mockLocalStorage.getItem('country_configurations');
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📦 Found data in localStorage:', Object.keys(data));
        
        // Update configurations from storage
        Object.entries(data).forEach(([code, config]) => {
          this.configurations.set(code, config);
        });
      } else {
        console.log('📦 No data found in localStorage, using defaults');
      }
    } catch (error) {
      console.error('❌ Error loading from storage:', error);
    }
  }

  getAllConfigurations() {
    return Array.from(this.configurations.values());
  }

  getAvailableCountries() {
    return Array.from(this.configurations.values()).filter(config => config.active);
  }

  saveToStorage() {
    const data = {};
    this.configurations.forEach((config, code) => {
      data[code] = config;
    });
    mockLocalStorage.setItem('country_configurations', JSON.stringify(data));
    console.log('💾 Saved to localStorage:', Object.keys(data));
  }
}

// Test the service
const service = new MockCountryConfigService();

console.log('\n📊 Current State:');
console.log('All configurations:', service.getAllConfigurations().length);
console.log('Available countries:', service.getAvailableCountries().length);

console.log('\n🏳️  All Countries:');
service.getAllConfigurations().forEach(config => {
  console.log(`   ${config.countryCode}: ${config.countryName} - Active: ${config.active ? '✅' : '❌'}`);
});

console.log('\n🎯 Available Countries (for order form):');
service.getAvailableCountries().forEach(config => {
  console.log(`   ${config.countryCode}: ${config.countryName}`);
});

// Simulate admin panel changes
console.log('\n🔧 Simulating admin panel changes...');
console.log('Setting UAE to inactive...');

const uaeConfig = service.configurations.get('AE');
if (uaeConfig) {
  uaeConfig.active = false;
  service.saveToStorage();
}

console.log('\n📊 After Admin Changes:');
console.log('Available countries:', service.getAvailableCountries().length);

console.log('\n🎯 Available Countries (for order form):');
service.getAvailableCountries().forEach(config => {
  console.log(`   ${config.countryCode}: ${config.countryName}`);
});

console.log('\n💡 Analysis:');
console.log('- Admin panel should show all countries with active/inactive toggles');
console.log('- Order form should only show countries where active = true');
console.log('- If admin shows 3 active but order shows 2, there\'s a sync issue');
console.log('- Check localStorage synchronization between admin and marketing apps');