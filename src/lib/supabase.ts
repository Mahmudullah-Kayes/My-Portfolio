import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

// Add error handling middleware
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});

// Instead of overriding the rpc method directly, which causes type issues,
// we'll use a separate function that logs errors but preserves the original behavior

export async function safeRpc<T = any>(fnName: string, params?: object, options?: any) {
  try {
    return await supabase.rpc(fnName, params, options);
  } catch (error) {
    console.error('Supabase RPC error:', error);
    throw error;
  }
} 