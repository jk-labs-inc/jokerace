import { isSupabaseConfigured } from "@helpers/database";

type ChargeDetails = {
  costToVote: number;
  isError: boolean;
};

const defaultChargeDetails: ChargeDetails = {
  costToVote: 0,
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
      .select("default_cost_to_vote")
      .eq("network_name", chainName.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("error fetching entry charge details:", error.message);
      return { ...defaultChargeDetails, isError: true };
    }

    return {
      costToVote: data?.default_cost_to_vote ?? 0,
      isError: false,
    };
  } catch (error: any) {
    console.error("Unexpected error fetching entry charge details:", error.message);
    return { ...defaultChargeDetails, isError: true };
  }
};
