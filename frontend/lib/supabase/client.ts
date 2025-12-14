import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Placeholder values for build time when env vars aren't available
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let client: SupabaseClient | null = null;

export function createClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // Use implicit flow for static exports (GitHub Pages)
        flowType: 'implicit',
        // Disable navigator.locks which can hang on static deployments
        lock: 'no-op',
        // Detect session from URL for OAuth callbacks
        detectSessionInUrl: true,
        // Persist session in localStorage
        persistSession: true,
        // Auto refresh token
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

// Check if Supabase is properly configured
export function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
}
