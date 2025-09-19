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
  supabaseUrl || 'https://placeholder.supabase.co', // Fallback to a placeholder URL
  supabaseAnonKey || 'placeholder-key', // Fallback to a placeholder key
  {
    auth: {
      persistSession: true,
      autoRefreshToken: isSupabaseConfigured,
    }
  }
);

export { supabase };
export default supabase;