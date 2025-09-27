const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createConsultantDirect() {
  console.log('🔧 Creating Consultant Profile with Direct SQL');
  console.log('==============================================\n');

  try {
    const consultantId = '0365c5c2-cec2-4d71-a505-81b257901c64';
    
    // First, check if profile already exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', consultantId);

    if (existing && existing.length > 0) {
      console.log('📋 Profile already exists:');
      console.log('  Role:', existing[0].role);
      console.log('  Email:', existing[0].email);
      
      if (existing[0].role !== 'consultant') {
        console.log('\n🔧 Updating role to consultant...');
        
        const updateSql = `
          UPDATE user_profiles 
          SET role = 'consultant', 
              company = 'Consulting19',
              is_active = true
          WHERE id = '${consultantId}';
        `;
        
        const { error: updateError } = await supabase.rpc('exec_sql', { sql: updateSql });
        
        if (updateError) {
          console.error('❌ Error updating role:', updateError);
        } else {
          console.log('✅ Role updated to consultant!');
        }
      } else {
        console.log('✅ User already has consultant role!');
      }
      return;
    }

    console.log('🔧 Creating new consultant profile...');

    // Use direct SQL INSERT
    const insertSql = `
      INSERT INTO user_profiles (
        id, email, full_name, first_name, last_name, role, company, phone,
        country_id, bio_en, bio_tr, experience_years, hourly_rate, is_active,
        timezone, commission_rate, storage_limit_gb, storage_used_bytes,
        mfa_enabled, metadata, created_at, updated_at
      ) VALUES (
        '${consultantId}',
        'giorgi.meskhi@consulting19.com',
        'Giorgi Meskhi',
        'Giorgi',
        'Meskhi',
        'consultant',
        'Consulting19',
        '+995 555 123 456',
        'b078d0fb-86a4-48dc-ba83-5d600479e074',
        'Experienced business consultant specializing in international business development.',
        'Uluslararası iş geliştirme konusunda uzman deneyimli iş danışmanı.',
        8,
        150.00,
        true,
        'Asia/Tbilisi',
        65.00,
        5.00,
        0,
        false,
        '{}',
        NOW(),
        NOW()
      );
    `;

    const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertSql });

    if (insertError) {
      console.error('❌ Error creating profile with SQL:', insertError);
      return;
    }

    console.log('✅ Consultant profile created successfully with SQL!');

    // Verify the creation
    const { data: verification, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', consultantId)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying profile:', verifyError);
      return;
    }

    console.log('🎉 Verification successful!');
    console.log('📋 Created Profile:');
    console.log('  ID:', verification.id);
    console.log('  Email:', verification.email);
    console.log('  Name:', verification.full_name);
    console.log('  Role:', verification.role);
    console.log('  Company:', verification.company);
    console.log('  Active:', verification.is_active);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createConsultantDirect();