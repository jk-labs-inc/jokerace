import { isSupabaseConfigured } from "@helpers/database";

export interface ExtensionSupabase {
  name: string;
}

interface BelloResponse {
  redirectUrl: string;
}

const BELLO_API_URL = "https://api.bello.lol/v2/jokerace/redirectUrl";

export const fetchExtensions = async (): Promise<ExtensionSupabase[]> => {
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

export const fetchBelloRedirectUrl = async (contractAddress: string, chain: string): Promise<BelloResponse> => {
  const apiUrl = `${BELLO_API_URL}?contractAddress=${contractAddress}&chain=${chain}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching from Bello API: ${response.statusText}`);
    }
    const data = (await response.json()) as BelloResponse;
    return data;
  } catch (e) {
    throw new Error(`Unexpected error in fetchBelloRedirectUrl: ${e instanceof Error ? e.message : e}`);
  }
};
