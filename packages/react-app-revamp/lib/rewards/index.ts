import { isSupabaseConfigured } from "@helpers/database";

export interface RewardToken {
  tokenAddress: string;
  balance: number;
}

export const getTokenAddresses = async (rewardsModuleAddress: string, networkName: string): Promise<string[]> => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data: tokens, error } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address")
      .eq("rewards_module_address", rewardsModuleAddress)
      .eq("network_name", networkName.toLowerCase())
      .not("token_address", "is", null);

    if (error) {
      throw new Error(error.message);
    }

    const uniqueTokens = new Set(tokens.map((token: { token_address: string }) => token.token_address));
    return Array.from(uniqueTokens);
  }

  return [];
};
