const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Database Development Workflow');
console.log('=' .repeat(50));

const workflow = {
  // 1. Yeni migration oluştur
  createMigration: (name) => {
    console.log(`\n1️⃣ Creating migration: ${name}`);
    try {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
      const filename = `${timestamp}_${name.replace(/\s+/g, '_').toLowerCase()}.sql`;
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', filename);
      
      // Boş migration dosyası oluştur
      const template = `-- Migration: ${name}
-- Created: ${new Date().toLocaleString()}
-- Description: Add your SQL changes here

-- Example:
-- CREATE TABLE IF NOT EXISTS example_table (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Don't forget to add RLS policies if needed:
-- ALTER TABLE example_table ENABLE ROW LEVEL SECURITY;
`;
      
      fs.writeFileSync(migrationPath, template);
      console.log(`✅ Migration created: ${filename}`);
      console.log(`📁 Path: ${migrationPath}`);
      
      return filename;
    } catch (error) {
      console.error(`❌ Migration creation failed: ${error.message}`);
      return null;
    }
  },

  // 2. Local test
  testLocal: () => {
    console.log('\n2️⃣ Testing on local Supabase...');
    try {
      // Local Supabase'i başlat
      console.log('🚀 Starting local Supabase...');
      execSync('supabase start', { stdio: 'inherit' });
      
      // Migration'ları uygula
      console.log('📦 Applying migrations...');
      execSync('supabase db reset', { stdio: 'inherit' });
      
      console.log('✅ Local test completed');
      return true;
    } catch (error) {
      console.error(`❌ Local test failed: ${error.message}`);
      return false;
    }
  },

  // 3. Production'a deploy
  deployProduction: (migrationFile) => {
    console.log('\n3️⃣ Deploying to production...');
    try {
      // Önce backup al
      console.log('💾 Creating backup...');
      execSync('node deploy-db-changes.cjs', { stdio: 'inherit' });
      
      // Migration'ı uygula
      if (migrationFile) {
        console.log(`🚀 Applying migration: ${migrationFile}`);
        execSync(`node deploy-db-changes.cjs ${migrationFile}`, { stdio: 'inherit' });
      }
      
      console.log('✅ Production deployment completed');
      return true;
    } catch (error) {
      console.error(`❌ Production deployment failed: ${error.message}`);
      return false;
    }
  },

  // 4. Verify changes
  verifyChanges: () => {
    console.log('\n4️⃣ Verifying changes...');
    try {
      execSync('node test-live-changes.cjs', { stdio: 'inherit' });
      console.log('✅ Verification completed');
      return true;
    } catch (error) {
      console.error(`❌ Verification failed: ${error.message}`);
      return false;
    }
  },

  // 5. Full workflow
  fullWorkflow: (migrationName) => {
    console.log(`\n🔄 Full workflow for: ${migrationName}`);
    
    // 1. Migration oluştur
    const migrationFile = workflow.createMigration(migrationName);
    if (!migrationFile) return false;
    
    console.log(`\n⏸️ Please edit the migration file:`);
    console.log(`📝 ${path.join(__dirname, 'supabase', 'migrations', migrationFile)}`);
    console.log(`\n⚡ After editing, run:`);
    console.log(`   node db-development-workflow.cjs test-and-deploy ${migrationFile}`);
    
    return migrationFile;
  },

  // 6. Test ve deploy
  testAndDeploy: (migrationFile) => {
    console.log(`\n🧪 Test and deploy: ${migrationFile}`);
    
    // Local test
    if (!workflow.testLocal()) {
      console.log('❌ Local test failed, aborting deployment');
      return false;
    }
    
    // Production deploy
    if (!workflow.deployProduction(migrationFile)) {
      console.log('❌ Production deployment failed');
      return false;
    }
    
    // Verify
    if (!workflow.verifyChanges()) {
      console.log('⚠️ Verification failed, please check manually');
    }
    
    console.log('\n🎉 Workflow completed successfully!');
    return true;
  }
};

// Command line interface
const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case 'create':
    if (!argument) {
      console.log('❌ Usage: node db-development-workflow.cjs create "migration_name"');
      process.exit(1);
    }
    workflow.createMigration(argument);
    break;
    
  case 'test':
    workflow.testLocal();
    break;
    
  case 'deploy':
    workflow.deployProduction(argument);
    break;
    
  case 'verify':
    workflow.verifyChanges();
    break;
    
  case 'full':
    if (!argument) {
      console.log('❌ Usage: node db-development-workflow.cjs full "migration_name"');
      process.exit(1);
    }
    workflow.fullWorkflow(argument);
    break;
    
  case 'test-and-deploy':
    if (!argument) {
      console.log('❌ Usage: node db-development-workflow.cjs test-and-deploy "migration_file.sql"');
      process.exit(1);
    }
    workflow.testAndDeploy(argument);
    break;
    
  default:
    console.log(`
🔧 Database Development Workflow Commands:

📝 Create new migration:
   node db-development-workflow.cjs create "add_payment_system"

🧪 Test locally:
   node db-development-workflow.cjs test

🚀 Deploy to production:
   node db-development-workflow.cjs deploy [migration_file.sql]

✅ Verify changes:
   node db-development-workflow.cjs verify

🔄 Full workflow (create + instructions):
   node db-development-workflow.cjs full "add_payment_system"

⚡ Test and deploy existing migration:
   node db-development-workflow.cjs test-and-deploy "20250101000000_add_payment_system.sql"

Examples:
  node db-development-workflow.cjs create "add user preferences"
  node db-development-workflow.cjs full "payment integration"
  node db-development-workflow.cjs test-and-deploy "20250101000000_add_payment_system.sql"
`);
    break;
}

module.exports = workflow;