import { isSupabaseConfigured } from "@helpers/database";

type ChargeDetails = {
  minCostToPropose: number;
  minCostToVote: number;
};

export const fetchChargeDetails = async (chainName: string): Promise<ChargeDetails> => {
  const defaultChargeDetails: ChargeDetails = { minCostToPropose: 0, minCostToVote: 0 };

  if (!isSupabaseConfigured || !chainName) return defaultChargeDetails;

  const config = await import("@config/supabase");
  const supabase = config.supabase;

  try {
    const { data, error } = await supabase
      .from("chain_params")
      .select("min_cost_to_propose, min_cost_to_vote")
      .eq("network_name", chainName.toLowerCase())
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching entry charge details:", error.message);
      return defaultChargeDetails;
    }

    return {
      minCostToPropose: data ? data.min_cost_to_propose : 0,
      minCostToVote: data ? data.min_cost_to_vote : 0,
    };
  } catch (error: any) {
    console.error("Unexpected error fetching entry charge details:", error.message);
    return defaultChargeDetails;
  }
};
