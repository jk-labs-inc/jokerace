import { isSupabaseConfigured } from "@helpers/database";

export interface RewardToken {
  tokenAddress: string;
  balance: number;
}

/**
 * Fetches the list of all ERC20 token addresses associated with a specific rewards module address.
 * This function retrieves unique token addresses from the analytics_rewards_v3 table in the database,
 * filtering by the given rewards module address and network name.
 *
 * @param rewardsModuleAddress address of the rewards module
 * @param networkName name of the chain
 * @returns a Promise that resolves to an array of unique ERC20 token addresses
 */
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

    const uniqueTokens = new Set(
      tokens
        .map((token: { token_address: string }) => token.token_address)
        .filter((address: string) => address !== "native"),
    );

    return Array.from(uniqueTokens);
  }

  return [];
};
