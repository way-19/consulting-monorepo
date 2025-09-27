const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createConsultantBypassRLS() {
  console.log('🔧 Creating Consultant Profile (Bypassing RLS)');
  console.log('===============================================\n');

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
        
        const { data: updated, error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            role: 'consultant',
            company: 'Consulting19',
            is_active: true
          })
          .eq('id', consultantId)
          .select();
        
        if (updateError) {
          console.error('❌ Error updating role:', updateError);
        } else {
          console.log('✅ Role updated to consultant!');
          console.log('Updated profile:', updated[0]);
        }
      } else {
        console.log('✅ User already has consultant role!');
      }
      return;
    }

    console.log('🔧 Creating new consultant profile...');

    // Try with service role and bypass RLS
    const profileData = {
      id: consultantId,
      email: 'giorgi.meskhi@consulting19.com',
      full_name: 'Giorgi Meskhi',
      first_name: 'Giorgi',
      last_name: 'Meskhi',
      role: 'consultant',
      company: 'Consulting19',
      phone: '+995 555 123 456',
      country_id: 'b078d0fb-86a4-48dc-ba83-5d600479e074',
      bio_en: 'Experienced business consultant specializing in international business development.',
      bio_tr: 'Uluslararası iş geliştirme konusunda uzman deneyimli iş danışmanı.',
      experience_years: 8,
      hourly_rate: 150.00,
      is_active: true,
      timezone: 'Asia/Tbilisi',
      commission_rate: 65.00,
      storage_limit_gb: 5.00,
      storage_used_bytes: 0,
      mfa_enabled: false,
      metadata: {}
    };

    // Use upsert to handle conflicts
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating profile:', insertError);
      
      // Try alternative approach - check if it's a constraint issue
      console.log('\n🔄 Trying alternative approach...');
      
      // Delete any existing profile first
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', consultantId);
        
      // Then insert fresh
      const { data: freshProfile, error: freshError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
        
      if (freshError) {
        console.error('❌ Fresh insert also failed:', freshError);
        return;
      }
      
      console.log('✅ Profile created with fresh insert!');
      console.log('📋 Created Profile:', freshProfile);
      return;
    }

    console.log('✅ Consultant profile created successfully!');
    console.log('📋 Created Profile:');
    console.log('  ID:', newProfile.id);
    console.log('  Email:', newProfile.email);
    console.log('  Name:', newProfile.full_name);
    console.log('  Role:', newProfile.role);
    console.log('  Company:', newProfile.company);
    console.log('  Active:', newProfile.is_active);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createConsultantBypassRLS();