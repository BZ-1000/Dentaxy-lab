
import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key are stored in env variables
const supabaseUrl = 'https://tlgofrhdhfklmjioearg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ29mcmhkaGZrbG1qaW9lYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NjA2ODEsImV4cCI6MjA1MzQzNjY4MX0.KIc6WzuoSPGFUGcyluoJc5ANXXyit4jBEedFZyE_lBk';

// Get the base URL for redirects
export const getURL = () => {
  let url = window?.location?.origin || 'https://dentaxy.com';
  
  // Make sure to include a trailing '/'
  return url.charAt(url.length - 1) === '/' ? url : `${url}/`;
};

// Create Supabase client with PKCE auth flow
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage
  }
});
