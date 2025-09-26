const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function createOrderTables() {
  console.log('🔧 Order form için eksik tabloları oluşturuyorum...\n');

  try {
    // Create packages table
    console.log('1. packages tablosu oluşturuluyor...');
    const { error: packagesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS packages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          delivery_time VARCHAR(50),
          features JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          is_popular BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Public read access to packages" ON packages
          FOR SELECT USING (true);
      `
    });

    if (packagesError) {
      console.log('   ❌ Hata:', packagesError.message);
    } else {
      console.log('   ✅ packages tablosu oluşturuldu');
    }

    // Create additional_services table
    console.log('2. additional_services tablosu oluşturuluyor...');
    const { error: servicesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS additional_services (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          description TEXT,
          base_price DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          category VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE additional_services ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Public read access to additional_services" ON additional_services
          FOR SELECT USING (true);
      `
    });

    if (servicesError) {
      console.log('   ❌ Hata:', servicesError.message);
    } else {
      console.log('   ✅ additional_services tablosu oluşturuldu');
    }

    // Create banks table
    console.log('3. banks tablosu oluşturuluyor...');
    const { error: banksError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS banks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          country_code VARCHAR(2),
          price DECIMAL(10,2) DEFAULT 0,
          currency VARCHAR(3) DEFAULT 'USD',
          description TEXT,
          requirements JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Public read access to banks" ON banks
          FOR SELECT USING (true);
      `
    });

    if (banksError) {
      console.log('   ❌ Hata:', banksError.message);
    } else {
      console.log('   ✅ banks tablosu oluşturuldu');
    }

    // Insert sample data
    console.log('\n4. Örnek veriler ekleniyor...');
    
    // Insert packages
    const { error: packageInsertError } = await supabase
      .from('packages')
      .insert([
        {
          name: 'Basic Company Formation',
          description: 'Standard company registration with basic documentation',
          price: 299.00,
          delivery_time: '5-7 business days',
          features: ['Company registration', 'Basic documentation', 'Tax ID'],
          is_popular: false
        },
        {
          name: 'Premium Company Formation',
          description: 'Complete company setup with additional services',
          price: 599.00,
          delivery_time: '3-5 business days',
          features: ['Company registration', 'Complete documentation', 'Tax ID', 'Bank account assistance', 'Legal consultation'],
          is_popular: true
        },
        {
          name: 'Express Company Formation',
          description: 'Fast-track company formation service',
          price: 899.00,
          delivery_time: '1-2 business days',
          features: ['Priority processing', 'Company registration', 'Complete documentation', 'Tax ID', 'Bank account assistance', 'Legal consultation', '24/7 support'],
          is_popular: false
        }
      ]);

    if (packageInsertError) {
      console.log('   ❌ Package verisi eklenirken hata:', packageInsertError.message);
    } else {
      console.log('   ✅ Package verileri eklendi');
    }

    // Insert additional services
    const { error: serviceInsertError } = await supabase
      .from('additional_services')
      .insert([
        {
          name: 'Virtual Office',
          description: 'Professional business address and mail handling',
          base_price: 49.00,
          category: 'office'
        },
        {
          name: 'Accounting Setup',
          description: 'Initial accounting system setup and consultation',
          base_price: 199.00,
          category: 'accounting'
        },
        {
          name: 'Legal Consultation',
          description: 'One-hour legal consultation with expert',
          base_price: 150.00,
          category: 'legal'
        },
        {
          name: 'Tax Advisory',
          description: 'Tax planning and advisory services',
          base_price: 250.00,
          category: 'tax'
        },
        {
          name: 'Bank Account Opening',
          description: 'Assistance with business bank account opening',
          base_price: 299.00,
          category: 'banking'
        }
      ]);

    if (serviceInsertError) {
      console.log('   ❌ Additional service verisi eklenirken hata:', serviceInsertError.message);
    } else {
      console.log('   ✅ Additional service verileri eklendi');
    }

    // Insert banks
    const { error: bankInsertError } = await supabase
      .from('banks')
      .insert([
        {
          name: 'Bank of Georgia',
          country_code: 'GE',
          price: 0,
          description: 'Leading bank in Georgia with excellent business services'
        },
        {
          name: 'TBC Bank',
          country_code: 'GE',
          price: 50,
          description: 'Modern digital banking solutions for businesses'
        },
        {
          name: 'Liberty Bank',
          country_code: 'GE',
          price: 25,
          description: 'Reliable banking partner for small and medium businesses'
        },
        {
          name: 'Banco Nacional',
          country_code: 'CR',
          price: 100,
          description: 'National bank of Costa Rica with comprehensive services'
        },
        {
          name: 'Banco Popular',
          country_code: 'CR',
          price: 75,
          description: 'Popular choice for international businesses in Costa Rica'
        }
      ]);

    if (bankInsertError) {
      console.log('   ❌ Bank verisi eklenirken hata:', bankInsertError.message);
    } else {
      console.log('   ✅ Bank verileri eklendi');
    }

    console.log('\n🎉 Tüm order form tabloları başarıyla oluşturuldu!');
    console.log('\n📋 Oluşturulan tablolar:');
    console.log('   - packages (3 kayıt)');
    console.log('   - additional_services (5 kayıt)');
    console.log('   - banks (5 kayıt)');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

createOrderTables();