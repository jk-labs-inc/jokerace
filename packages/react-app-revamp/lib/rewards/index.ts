import { isSupabaseConfigured } from "@helpers/database";

export const getUnpaidRewardTokens = async (rewardsModuleAddress: string) => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data: tokens, error } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address")
      .eq("rewards_module_address", rewardsModuleAddress)
      .not("amount_paid_in", "is", null)
      .is("amount_paid_out", null);

    if (error) {
      throw new Error(error.message);
    }

    return tokens;
  }
};

export const getPaidRewardTokens = async (rewardsModuleAddress: string) => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data: tokens, error } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address")
      .eq("rewards_module_address", rewardsModuleAddress)
      .not("amount_paid_out", "is", null);

    if (error) {
      throw new Error(error.message);
    }

    return tokens;
  }
};
