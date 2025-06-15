
import { createClient } from "@supabase/supabase-js";

// Uses VITE envs if provided by Lovable backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Connect Supabase in Lovable project settings.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** 
 * SCHEMA SUGGESTIONS (run as SQL in Supabase):
 * - users: handled by Supabase Auth
 * - connections: id, user_id, provider, access_token, refresh_token, expires_in, created_at
 * - kpis: id, user_id, provider, metric, value, date, meta_json, created_at
 * - alerts: id, user_id, type, threshold, enabled, last_triggered, created_at
 */
