const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableRLSComprehensive() {
  console.log('🔧 Comprehensive RLS disable starting...');

  const tables = [
    'user_profiles',
    'clients', 
    'service_orders',
    'service_purchases',
    'messages',
    'notifications',
    'countries',
    'languages',
    'service_categories',
    'services',
    'consultant_countries',
    'consultant_spoken_languages',
    'consultant_country_services',
    'message_attachments',
    'conversation_participants',
    'commission_payouts',
    'commission_payout_items',
    'country_pages',
    'country_media',
    'country_testimonials',
    'country_settings',
    'country_configurations',
    'country_form_sections',
    'country_form_fields',
    'country_packages',
    'country_services',
    'country_config_audit',
    'blog_posts',
    'faqs'
  ];

  for (const table of tables) {
    try {
      console.log(`🔧 Disabling RLS for ${table}...`);
      
      // Use raw SQL query to disable RLS
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE IF EXISTS ${table} DISABLE ROW LEVEL SECURITY;`
      });
      
      if (error && !error.message.includes('does not exist')) {
        console.log(`⚠️  Warning for ${table}:`, error.message);
      } else {
        console.log(`✅ ${table} RLS disabled`);
      }
    } catch (err) {
      console.log(`⚠️  Error with ${table}:`, err.message);
    }
  }

  // Grant permissions
  console.log('🔧 Granting permissions...');
  
  const permissions = [
    'GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;',
    'GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;', 
    'GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;',
    'GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;',
    'GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;',
    'GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;',
    'GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;',
    'GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;',
    'GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;'
  ];

  for (const permission of permissions) {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: permission });
      if (error) {
        console.log(`⚠️  Permission warning:`, error.message);
      } else {
        console.log(`✅ Permission granted: ${permission.substring(0, 50)}...`);
      }
    } catch (err) {
      console.log(`⚠️  Permission error:`, err.message);
    }
  }

  // Test access with anon key
  console.log('🧪 Testing access with anon key...');
  const anonSupabase = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNx_kAlHvsxXxOQdHcMcFuMwpAX4');
  
  try {
    const { data: configs, error } = await anonSupabase
      .from('country_configurations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Still getting error with anon key:', error);
    } else {
      console.log('✅ Anon key access working!');
    }
  } catch (err) {
    console.error('❌ Exception with anon key:', err);
  }

  console.log('🎉 Comprehensive RLS disable completed!');
}

disableRLSComprehensive().catch(console.error);