import { supabase } from '../../lib/supabaseClient';

/**
 * Pings Supabase to keep the project active
 * This function performs a simple query to prevent the project from being paused
 */
export async function pingSupabase() {
  try {
    // Insert a new ping record to keep the connection alive
    const { data, error } = await supabase
      .from('_pings')
      .insert({ created_at: new Date().toISOString() })
      .select();
    
    if (error) {
      console.error('Error pinging Supabase:', error.message);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      timestamp: new Date().toISOString() 
    };
  } catch (err) {
    console.error('Failed to ping Supabase:', err);
    return { success: false, error: String(err) };
  }
} 