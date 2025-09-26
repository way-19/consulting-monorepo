import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the values to help the user debug if they are still missing
console.log('Supabase URL from env:', supabaseUrl || 'Not set');
console.log('Supabase Anon Key from env:', supabaseAnonKey ? '*****' : 'Not set'); // Mask key for security

// Check if Supabase is properly configured
const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables are missing or empty. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
  console.warn('If you are running in development, ensure your .env file is in the project root and contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const supabase = createClient(
  supabaseUrl || 'http://127.0.0.1:54321', // Fallback to local development URL
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0', // Fallback to local development key
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true, // Always enable auto refresh for better UX
    }
  }
);

export { supabase };
export default supabase;