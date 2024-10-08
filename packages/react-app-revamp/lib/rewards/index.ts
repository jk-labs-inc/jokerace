export interface RewardToken {
  tokenAddress: string;
  balance: number;
}

/**
 * fetches the list of all erc20 token addresses associated with a specific rewards module address.
 * this function calls an api route to retrieve unique token addresses from the database,
 * filtering by the given rewards module address and network name.
 *
 * @param rewardsModuleAddress address of the rewards module
 * @param networkName name of the chain
 * @returns a promise that resolves to an array of unique erc20 token addresses
 */
export const getTokenAddresses = async (rewardsModuleAddress: string, networkName: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `/api/rewards/token-addresses?rewardsModuleAddress=${encodeURIComponent(rewardsModuleAddress)}&networkName=${encodeURIComponent(networkName)}`,
    );

    if (!response.ok) {
      throw new Error("failed to fetch token addresses");
    }

    const tokenAddresses: string[] = await response.json();
    return tokenAddresses;
  } catch (error) {
    console.error("error fetching token addresses:", error);
    return [];
  }
};
