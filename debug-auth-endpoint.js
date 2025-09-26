// Using built-in fetch (Node.js 18+)

console.log('🔍 Debugging Authentication Endpoint');
console.log('=====================================\n');

const supabaseUrl = 'http://127.0.0.1:54321';
const authUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`;

console.log(`Testing endpoint: ${authUrl}`);

async function testAuthEndpoint() {
  try {
    console.log('\n1. Testing basic connectivity to Supabase...');
    
    // Test basic connectivity
    const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      }
    });
    
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.ok) {
      console.log('   ✅ Basic connectivity working');
    } else {
      console.log('   ❌ Basic connectivity failed');
      const errorText = await healthResponse.text();
      console.log(`   Error: ${errorText}`);
    }
    
    console.log('\n2. Testing auth endpoint with valid credentials...');
    
    // Test auth endpoint
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      },
      body: JSON.stringify({
        email: 'admin@consulting19.com',
        password: 'admin123'
      })
    });
    
    console.log(`   Status: ${authResponse.status}`);
    
    if (authResponse.ok) {
      console.log('   ✅ Authentication successful');
      const authData = await authResponse.json();
      console.log(`   User: ${authData.user?.email}`);
    } else {
      console.log('   ❌ Authentication failed');
      const errorText = await authResponse.text();
      console.log(`   Error response: ${errorText}`);
      
      // Try to parse as JSON for more details
      try {
        const errorJson = JSON.parse(errorText);
        console.log(`   Error details:`, errorJson);
      } catch (e) {
        console.log(`   Raw error: ${errorText}`);
      }
    }
    
    console.log('\n3. Testing with different credentials...');
    
    const testCredentials = [
      { email: 'admin@consulting19.com', password: 'Admin123!' },
      { email: 'test@example.com', password: 'test123' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`\n   Testing ${cred.email}...`);
      
      const testResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        },
        body: JSON.stringify(cred)
      });
      
      console.log(`   Status: ${testResponse.status}`);
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.log(`   Error: ${errorText.substring(0, 100)}...`);
      } else {
        console.log(`   ✅ Success`);
      }
    }
    
    console.log('\n4. Checking Supabase service status...');
    
    // Check if all services are running
    const services = [
      { name: 'REST API', path: '/rest/v1/' },
      { name: 'Auth', path: '/auth/v1/health' },
      { name: 'Storage', path: '/storage/v1/health' }
    ];
    
    for (const service of services) {
      try {
        const serviceResponse = await fetch(`${supabaseUrl}${service.path}`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
          }
        });
        
        console.log(`   ${service.name}: ${serviceResponse.status} ${serviceResponse.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`   ${service.name}: ❌ Connection failed - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAuthEndpoint();