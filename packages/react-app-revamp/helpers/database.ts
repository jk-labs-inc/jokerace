export const isSupabaseConfigured = (supabaseUrl: string | undefined, supabaseAnonKey: string | undefined): boolean => {
  return supabaseUrl !== undefined && supabaseUrl !== "" && supabaseAnonKey !== undefined && supabaseAnonKey !== "";
};
