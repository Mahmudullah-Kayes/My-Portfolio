import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Function to create a Supabase client with the proper configuration
export function createClient() {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ielnmrbzdausronymhdc.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbG5tcmJ6ZGF1c3JvbnltaGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTk3MjksImV4cCI6MjA2MDM3NTcyOX0.CKIqa7294ynyV5EE0P3ZPfbsWytmFgolp6vRp6zhPss";
  
  // Create and return the Supabase client
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
} 