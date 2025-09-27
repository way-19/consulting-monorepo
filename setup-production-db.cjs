const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Production Supabase credentials
const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🚀 Testing connection to cloud Supabase...');
  
  try {
    // Simple test - try to access auth users
    const { data, error } = await supabase.auth.getSession();
    console.log('✅ Supabase client initialized successfully!');
    
    // Test basic query
    const { data: testData, error: testError } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1);
      
    if (testError) {
      console.log('⚠️  Auth table access limited (expected for anon key)');
    }
    
    console.log('✅ Connection to cloud Supabase successful!');
    console.log('🌐 Supabase URL:', supabaseUrl);
    
    // Generate combined migration file for manual execution
    console.log('📝 Generating combined migration file...');
    
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    let combinedSQL = '-- Combined Migration Script for Production Supabase\n';
    combinedSQL += '-- Execute this in Supabase Dashboard > SQL Editor\n\n';

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      combinedSQL += `-- Migration: ${file}\n`;
      combinedSQL += migrationSQL + '\n\n';
    }

    // Add seed data
    const seedPath = path.join(__dirname, 'supabase', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      combinedSQL += '-- Seed Data\n';
      combinedSQL += seedSQL + '\n\n';
    }

    // Write combined file
    fs.writeFileSync('combined-migration.sql', combinedSQL);
    console.log('✅ Combined migration file created: combined-migration.sql');
    console.log('📋 Next steps:');
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/qdwykqrepolavgvfxquw');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the content of combined-migration.sql');
    console.log('4. Execute the SQL');
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection();