import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

console.log('🔐 Testing All User Credentials');
console.log('================================\n');

const testCredentials = [
  // Current passwords (lowercase)
  { email: 'admin@consulting19.com', password: 'admin123', label: 'Admin (lowercase)' },
  { email: 'giorgi.meskhi@consulting19.com', password: 'consultant123', label: 'Consultant (lowercase)' },
  { email: 'client@consulting19.com', password: 'client123', label: 'Client (lowercase)' },
  
  // Frontend displayed passwords (with capitals and exclamation)
  { email: 'admin@consulting19.com', password: 'Admin123!', label: 'Admin (frontend display)' },
  { email: 'giorgi.meskhi@consulting19.com', password: 'Consultant123!', label: 'Consultant (frontend display)' },
  { email: 'client@consulting19.com', password: 'Client123!', label: 'Client (frontend display)' },
];

async function testAllCredentials() {
  for (const cred of testCredentials) {
    console.log(`Testing ${cred.label}:`);
    console.log(`  Email: ${cred.email}`);
    console.log(`  Password: ${cred.password}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });
      
      if (error) {
        console.log(`  ❌ Failed: ${error.message}`);
      } else {
        console.log(`  ✅ Success! User: ${data.user.email}`);
        console.log(`  Role: ${data.user.user_metadata?.role || 'No role'}`);
        
        // Sign out immediately
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
    }
    
    console.log('');
  }
}

testAllCredentials();