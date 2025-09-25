import { isSupabaseConfigured } from "@helpers/database";

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

    console.log({ rewardsModuleAddress, networkName });

    const { data: tokens, error } = await supabase
      .from("analytics_rewards_v3")
      .select("token_address")
      .ilike("rewards_module_address", rewardsModuleAddress)
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

/**
 * Inserts a contest with voting rewards into the database.
 * @param contestAddress contest address
 * @param chainName chain name
 * @returns true if the contest was inserted successfully, false otherwise
 */
export const insertContestWithOfficialModule = async (contestAddress: string, chainName: string): Promise<boolean> => {
  if (isSupabaseConfigured) {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      const { error } = await supabase
        .from("contests_with_official_modules")
        .insert({ network_name: chainName.toLowerCase(), address: contestAddress, type: "voters" });

      if (error) {
        console.error("Error inserting contest with official module:", error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to insert contest with official module:", error);
      return false;
    }
  }

  return false;
};

/**
 * Fetches token addresses for a contract
 * @param contractAddress the rewards module contract address
 * @param contestChainName the chain name
 * @returns array of token addresses
 */
export const fetchTokenAddresses = async (
  contractAddress: `0x${string}`,
  contestChainName: string,
): Promise<`0x${string}`[]> => {
  try {
    return (await getTokenAddresses(contractAddress, contestChainName)) as `0x${string}`[];
  } catch (error) {
    console.error("Failed to fetch token addresses:", error);
    return [];
  }
};
