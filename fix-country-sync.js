// Bu script localStorage'daki ülke verilerini kontrol eder ve düzeltir
// Browser console'da çalıştırın (Admin panel açıkken)

console.log('🔧 Fixing country synchronization...\n');

// Check current localStorage
const stored = localStorage.getItem('country_configurations');
if (stored) {
  try {
    const configs = JSON.parse(stored);
    console.log('📊 Current configurations in localStorage:');
    
    Object.values(configs).forEach(config => {
      console.log(`  ${config.countryCode}: ${config.countryName} - ${config.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}`);
    });
    
    // Count active countries
    const activeConfigs = Object.values(configs).filter(config => config.active);
    console.log(`\n✅ Currently active countries: ${activeConfigs.length}`);
    
    // If you want to activate a specific country, uncomment and modify:
    // configs['US'] = { ...configs['US'], active: true };
    // configs['AE'] = { ...configs['AE'], active: true };
    
    // Example: Activate Estonia (EE) if it exists
    if (configs['EE']) {
      console.log('\n🔧 Activating Estonia (EE)...');
      configs['EE'] = { ...configs['EE'], active: true };
      localStorage.setItem('country_configurations', JSON.stringify(configs));
      console.log('✅ Estonia activated!');
    }
    
    // Example: Activate United States (US) if it exists
    if (configs['US']) {
      console.log('🔧 Activating United States (US)...');
      configs['US'] = { ...configs['US'], active: true };
      localStorage.setItem('country_configurations', JSON.stringify(configs));
      console.log('✅ United States activated!');
    }
    
    // Reload the page to see changes
    console.log('\n🔄 Reloading page to apply changes...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error parsing localStorage:', error);
  }
} else {
  console.log('💾 No configurations found in localStorage');
  console.log('🔧 Initializing default configurations...');
  
  // Initialize with default countries
  const defaultConfigs = {
    'GE': {
      countryCode: 'GE',
      countryName: 'Georgia',
      active: true,
      basePrice: 1200,
      timeframe: '5-7 days',
      currency: 'USD'
    },
    'EE': {
      countryCode: 'EE',
      countryName: 'Estonia',
      active: true,
      basePrice: 1500,
      timeframe: '7-10 days',
      currency: 'EUR'
    },
    'US': {
      countryCode: 'US',
      countryName: 'United States',
      active: true,
      basePrice: 2000,
      timeframe: '10-14 days',
      currency: 'USD'
    }
  };
  
  localStorage.setItem('country_configurations', JSON.stringify(defaultConfigs));
  console.log('✅ Default configurations initialized!');
  window.location.reload();
}