import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  return createClient(supabaseUrl, supabaseAnonKey);
};
