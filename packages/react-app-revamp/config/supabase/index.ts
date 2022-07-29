import { createClient } from "@supabase/supabase-js";

const SUPABASE_ENV_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabaseUrl = SUPABASE_ENV_URL === "" ? "https://zcwdleddygnvejastxdm.supabase.co" : SUPABASE_ENV_URL;
const supabaseAnonKey =
  SUPABASE_ANON_KEY === ""
    ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjd2RsZWRkeWdudmVqYXN0eGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTkwMTE0ODcsImV4cCI6MTk3NDU4NzQ4N30.jh_Ssxyf_W3bgHpJwMXVmOixGxwEItHb93EfHubDYPw"
    : SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
