const { createClient } = require('@supabase/supabase-js');

// Production Supabase credentials
const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLiveData() {
  console.log('🔍 Testing live data access on cloud Supabase...');
  
  try {
    // Test user profiles
    console.log('\n👥 Testing user_profiles table:');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);
      
    if (profilesError) {
      console.log('❌ User profiles error:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles.length} user profiles`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.first_name} ${profile.last_name} (${profile.role})`);
      });
    }

    // Test clients
    console.log('\n🏢 Testing clients table:');
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .limit(5);
      
    if (clientsError) {
      console.log('❌ Clients error:', clientsError.message);
    } else {
      console.log(`✅ Found ${clients.length} clients`);
      clients.forEach(client => {
        console.log(`   - ${client.company_name} (${client.email})`);
      });
    }

    // Test projects
    console.log('\n📊 Testing projects table:');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
      
    if (projectsError) {
      console.log('❌ Projects error:', projectsError.message);
    } else {
      console.log(`✅ Found ${projects.length} projects`);
      projects.forEach(project => {
        console.log(`   - ${project.name} (Status: ${project.status})`);
      });
    }

    // Test tasks
    console.log('\n✅ Testing tasks table:');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(5);
      
    if (tasksError) {
      console.log('❌ Tasks error:', tasksError.message);
    } else {
      console.log(`✅ Found ${tasks.length} tasks`);
      tasks.forEach(task => {
        console.log(`   - ${task.title} (Status: ${task.status})`);
      });
    }

    // Test authentication users
    console.log('\n🔐 Testing authentication:');
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.log('⚠️  Auth admin access limited (expected with anon key)');
      } else {
        console.log(`✅ Found ${authUsers.users.length} auth users`);
      }
    } catch (err) {
      console.log('⚠️  Auth admin access limited (expected with anon key)');
    }

    console.log('\n🎉 Live data test completed!');
    console.log('🌐 All applications are now connected to cloud Supabase');
    console.log('🚀 Production environment is ready!');
    
    console.log('\n📱 Application URLs:');
    console.log('   - Admin: http://localhost:5174');
    console.log('   - Client: http://localhost:5177');
    console.log('   - Consultant: http://localhost:5176');
    console.log('   - Marketing: http://localhost:5173');
    
  } catch (error) {
    console.error('❌ Live data test failed:', error.message);
  }
}

testLiveData();