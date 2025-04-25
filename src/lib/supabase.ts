import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Function to safely create the Supabase client
function createSafeClient() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Only throw errors in browser environment where they'll be caught by error boundaries
  if (!supabaseUrl) {
    if (isBrowser) {
      console.error('Missing Supabase URL environment variable');
    } else {
      // During SSR or static generation, return a dummy client
      return createDummyClient();
    }
  }
  
  if (!supabaseAnonKey) {
    if (isBrowser) {
      console.error('Missing Supabase Anon Key environment variable');
    } else {
      // During SSR or static generation, return a dummy client
      return createDummyClient();
    }
  }
  
  // Create the real client if we have all we need
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });
  }
  
  // Fallback to dummy client
  return createDummyClient();
}

// Create a dummy Supabase client that won't throw errors during build/SSR
function createDummyClient() {
  // Return an object that mimics the Supabase client but with no-op functions
  return {
    from: () => ({
      select: () => ({
        limit: () => ({
          order: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    }),
    auth: {
      onAuthStateChange: () => ({ data: null, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
    }),
    removeChannel: () => {},
    rpc: () => Promise.resolve({ data: null, error: null }),
  };
}

// Export the safely created client
export const supabase = createSafeClient();

// Safe RPC function that handles errors
export async function safeRpc(fnName: string, params?: object, options?: any) {
  try {
    return await supabase.rpc(fnName, params, options);
  } catch (error) {
    console.error('Supabase RPC error:', error);
    throw error;
  }
} 