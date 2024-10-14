import { isSupabaseConfigured } from "@helpers/database";

type ChargeDetails = {
  minCostToPropose: number;
  minCostToVote: number;
  defaultCostToPropose: number;
  defaultCostToVote: number;
  isError: boolean;
};

const defaultChargeDetails: ChargeDetails = {
  minCostToPropose: 0,
  minCostToVote: 0,
  defaultCostToPropose: 0,
  defaultCostToVote: 0,
  isError: false,
};

export const fetchChargeDetails = async (chainName: string): Promise<ChargeDetails> => {
  if (!isSupabaseConfigured || !chainName) {
    return { ...defaultChargeDetails, isError: true };
  }

  const config = await import("@config/supabase");
  const supabase = config.supabase;

  try {
    const { data, error } = await supabase
      .from("chain_params")
      .select("min_cost_to_propose, min_cost_to_vote, default_cost_to_propose, default_cost_to_vote")
      .eq("network_name", chainName.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("error fetching entry charge details:", error.message);
      return { ...defaultChargeDetails, isError: true };
    }

    return {
      minCostToPropose: data?.min_cost_to_propose ?? 0,
      minCostToVote: data?.min_cost_to_vote ?? 0,
      defaultCostToPropose: data?.default_cost_to_propose ?? 0,
      defaultCostToVote: data?.default_cost_to_vote ?? 0,
      isError: false,
    };
  } catch (error: any) {
    console.error("Unexpected error fetching entry charge details:", error.message);
    return { ...defaultChargeDetails, isError: true };
  }
};
