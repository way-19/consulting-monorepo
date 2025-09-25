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
  supabaseUrl || 'https://qdwykqrepolavgvfxquw.supabase.co', // Fallback to actual Supabase URL from .env
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo', // Fallback to actual key from .env
  {
    auth: {
      persistSession: true,
      autoRefreshToken: isSupabaseConfigured,
    }
  }
);

export { supabase };
export default supabase;