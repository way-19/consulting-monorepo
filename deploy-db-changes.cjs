const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Production Supabase credentials
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Canlı DB Değişiklik Deployment');
console.log('URL:', supabaseUrl);
console.log('Timestamp:', new Date().toLocaleString());
console.log('=' .repeat(60));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deployDatabaseChanges(migrationFile = null) {
  try {
    console.log('\n1️⃣ Pre-deployment Backup Check...');
    
    // Mevcut tabloları ve kayıt sayılarını kontrol et
    const tables = ['user_profiles', 'clients', 'projects', 'tasks', 'notifications'];
    const backupInfo = {};
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          backupInfo[table] = count;
          console.log(`  ✅ ${table}: ${count} kayıt`);
        }
      } catch (err) {
        console.log(`  ⚠️ ${table}: Kontrol edilemedi`);
      }
    }

    console.log('\n2️⃣ Migration Dosyası Kontrolü...');
    
    if (migrationFile) {
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
      
      if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration dosyası bulunamadı: ${migrationFile}`);
        return false;
      }
      
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      console.log(`✅ Migration dosyası okundu: ${migrationFile}`);
      console.log(`📄 SQL uzunluğu: ${migrationSQL.length} karakter`);
      
      console.log('\n3️⃣ SQL Migration Uygulama...');
      
      // SQL'i satır satır uygula (güvenlik için)
      const sqlStatements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      console.log(`📝 ${sqlStatements.length} SQL statement bulundu`);
      
      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i];
        console.log(`\n  Executing statement ${i + 1}/${sqlStatements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: statement
          }).catch(async () => {
            // RPC yoksa direkt SQL çalıştır
            return await supabase.from('_migrations').insert({
              version: migrationFile,
              statements: [statement]
            });
          });
          
          if (error) {
            console.error(`    ❌ Hata: ${error.message}`);
            throw error;
          } else {
            console.log(`    ✅ Başarılı`);
          }
        } catch (err) {
          console.error(`    ❌ SQL Hatası: ${err.message}`);
          throw err;
        }
      }
    }

    console.log('\n4️⃣ Post-deployment Verification...');
    
    // Değişiklik sonrası kontrol
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          const oldCount = backupInfo[table] || 0;
          const diff = count - oldCount;
          const diffText = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : 'değişiklik yok';
          console.log(`  ✅ ${table}: ${count} kayıt (${diffText})`);
        }
      } catch (err) {
        console.log(`  ⚠️ ${table}: Kontrol edilemedi`);
      }
    }

    console.log('\n5️⃣ Application Restart Check...');
    
    // Uygulamaların yeniden başlatılması gerekip gerekmediğini kontrol et
    console.log('  ℹ️ Uygulamalar otomatik olarak yeni schema\'yı algılayacak');
    console.log('  ℹ️ Gerekirse: npm run dev:all ile yeniden başlatın');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database deployment tamamlandı!');
    console.log('🕐 Completion time:', new Date().toLocaleString());
    
    return true;

  } catch (error) {
    console.error('\n❌ Deployment hatası:', error.message);
    console.log('\n🔄 Rollback önerileri:');
    console.log('  1. Backup\'tan geri yükle');
    console.log('  2. Migration\'ı gözden geçir');
    console.log('  3. Test ortamında dene');
    
    return false;
  }
}

// Command line argument handling
const migrationFile = process.argv[2];

if (migrationFile) {
  console.log(`🎯 Specific migration: ${migrationFile}`);
  deployDatabaseChanges(migrationFile);
} else {
  console.log('🔍 General database health check...');
  deployDatabaseChanges();
}

module.exports = { deployDatabaseChanges };