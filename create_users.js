import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'admin@consulting19.com',
    password: 'Admin123!',
    profile: {
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      phone: '+1234567890'
    }
  },
  {
    email: 'giorgi.meskhi@consulting19.com',
    password: 'Consultant123!',
    profile: {
      first_name: 'Giorgi',
      last_name: 'Meskhi',
      role: 'consultant',
      phone: '+995555123456'
    }
  },
  {
    email: 'client@consulting19.com',
    password: 'Client123!',
    profile: {
      first_name: 'Test',
      last_name: 'Client',
      role: 'client',
      phone: '+1987654321'
    }
  }
];

async function createTestUsers() {
  console.log('Creating test users...');
  
  const createdUsers = [];
  
  for (const user of testUsers) {
    try {
      console.log(`Processing user: ${user.email}`);
      
      // First, try to get existing auth user
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      let authUser = existingUsers.users.find(u => u.email === user.email);
      
      if (!authUser) {
        // Create auth user if doesn't exist
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        });
        
        if (authError) {
          console.error(`Error creating auth user ${user.email}:`, authError);
          continue;
        }
        
        authUser = authData.user;
        console.log(`Auth user created: ${authUser.id}`);
      } else {
        console.log(`Auth user already exists: ${authUser.id}`);
      }
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
      
      if (existingProfile) {
        console.log(`Profile already exists for ${user.email}`);
        createdUsers.push({
          auth: authUser,
          profile: existingProfile
        });
        continue;
      }
      
      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authUser.id,
          email: user.email,
          ...user.profile
        })
        .select()
        .single();
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError);
        continue;
      }
      
      console.log(`Profile created for ${user.email}`);
      createdUsers.push({
        auth: authUser,
        profile: profileData
      });
      
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error);
    }
  }
  
  // Create client record and assignment
  const clientUser = createdUsers.find(u => u.auth.email === 'client@consulting19.com');
  const consultantUser = createdUsers.find(u => u.auth.email === 'giorgi.meskhi@consulting19.com');
  
  if (clientUser && consultantUser) {
    console.log('Creating client record...');
    
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        profile_id: clientUser.profile.id,
        company_name: 'Test Company Ltd',
        industry: 'Technology',
        target_countries: ['United States', 'United Kingdom'],
        assigned_consultant_id: consultantUser.profile.id,
        status: 'active'
      })
      .select()
      .single();
    
    if (clientError) {
      console.error('Error creating client record:', clientError);
    } else {
      console.log('Client record created');
    }
    
    // Create user assignment
    console.log('Creating user assignment...');
    
    const { data: assignmentData, error: assignmentError } = await supabase
      .from('user_assignments')
      .insert({
        consultant_id: consultantUser.profile.id,
        client_id: clientUser.profile.id,
        assigned_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (assignmentError) {
      console.error('Error creating user assignment:', assignmentError);
    } else {
      console.log('User assignment created');
    }
  }
  
  console.log('Test users creation completed!');
  console.log('Created users:', createdUsers.map(u => ({ email: u.auth.email, id: u.auth.id })));
}

createTestUsers().catch(console.error);