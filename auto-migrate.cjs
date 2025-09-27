const fs = require('fs');
const path = require('path');

// Production Supabase credentials
const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo';

async function executeMigrations() {
  console.log('🚀 Starting automated migration process...');
  
  try {
    // Read all migration files in order
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files`);

    // Execute each migration using REST API
    for (const file of migrationFiles) {
      console.log(`⚡ Processing migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            sql: migrationSQL
          })
        });

        if (response.ok) {
          console.log(`✅ Migration ${file} executed successfully`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️  Migration ${file} response: ${response.status} - ${errorText}`);
        }
      } catch (err) {
        console.log(`⚠️  Migration ${file} execution note: ${err.message}`);
      }
    }

    // Execute seed data
    console.log('🌱 Processing seed data...');
    const seedPath = path.join(__dirname, 'supabase', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            sql: seedSQL
          })
        });

        if (response.ok) {
          console.log('✅ Seed data executed successfully');
        } else {
          const errorText = await response.text();
          console.log(`⚠️  Seed data response: ${response.status} - ${errorText}`);
        }
      } catch (err) {
        console.log(`⚠️  Seed data execution note: ${err.message}`);
      }
    }

    console.log('🎉 Migration process completed!');
    console.log('🔍 Now testing database connectivity...');
    
    // Test basic connectivity
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/user_profiles?select=id&limit=1`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    });

    if (testResponse.ok) {
      console.log('✅ Database tables accessible via REST API');
    } else {
      console.log('⚠️  Database table access test:', testResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
  }
}

executeMigrations();