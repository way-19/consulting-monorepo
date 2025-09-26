import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetAdminPassword() {
  console.log('🔧 Resetting admin password...');
  
  try {
    // First, let's check if admin user exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return;
    }
    
    const adminUser = users.users.find(u => u.email === 'admin@consulting19.com');
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Found admin user:', adminUser.id);
    
    // Update the password
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: 'admin123' }
    );
    
    if (error) {
      console.error('❌ Error updating password:', error);
    } else {
      console.log('✅ Password updated successfully');
    }
    
    // Test login
    console.log('🧪 Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@consulting19.com',
      password: 'admin123'
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError);
    } else {
      console.log('✅ Login test successful');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

resetAdminPassword();