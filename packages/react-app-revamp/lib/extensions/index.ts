import { isSupabaseConfigured } from "@helpers/database";

interface Extension {
  name: string;
}

export const fetchExtensions = async (): Promise<Extension[]> => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured");
  }

  try {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data, error } = await supabase.from("extensions").select("name").eq("enabled", true);

    if (error) {
      throw new Error(`Error in fetchExtensions: ${error.message}`);
    }

    return data || [];
  } catch (e) {
    throw e;
  }
};
