import { isSupabaseConfigured } from "@helpers/database";

export const fetchEntryChargeDetails = async (chainName: string): Promise<number> => {
  if (!isSupabaseConfigured || !chainName) return 0;

  const config = await import("@config/supabase");
  const supabase = config.supabase;

  try {
    const { data, error } = await supabase
      .from("entry_charge")
      .select("min_cost_to_propose")
      .eq("network_name", chainName)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching entry charge details:", error.message);
      return 0;
    }

    return data ? data.min_cost_to_propose : 0;
  } catch (error: any) {
    console.error("Unexpected error fetching entry charge details:", error.message);
    return 0;
  }
};
