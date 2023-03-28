export const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
