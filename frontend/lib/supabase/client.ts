import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// Placeholder values for build time when env vars aren't available
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let client: SupabaseClient | null = null;

// No-op lock function for static deployments where navigator.locks can hang
const noOpLock = async <R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> => {
  return await fn();
};

export function createClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // Use implicit flow for static exports (GitHub Pages)
        flowType: 'implicit',
        // Disable navigator.locks which can hang on static deployments
        lock: noOpLock,
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
