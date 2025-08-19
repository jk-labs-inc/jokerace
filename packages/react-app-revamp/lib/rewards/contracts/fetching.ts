import { config } from "@config/wagmi";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import { RewardsParams } from "@hooks/useUserRewards";
import { readContracts } from "@wagmi/core";
import { Abi } from "viem";
import { fetchTokenAddresses } from "../database";
import { ModuleType } from "../types";
import { createERC20TokenQuery, createNativeTokenQuery } from "../utils";
import { validateRankings } from "./validation";

/**
 * Fetches releasable rewards
 * @param moduleType type of the rewards module
 * @param validRankings valid rankings
 * @param tokenAddresses token addresses
 * @param contractAddress contract address
 * @param chainId chain ID
 * @param abi ABI of the contract
 * @param userAddress user address
 * @returns releasable rewards
 */
export async function fetchReleasableRewards(
  moduleType: ModuleType,
  validRankings: number[],
  tokenAddresses: `0x${string}`[],
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  userAddress?: `0x${string}`,
): Promise<any[]> {
  const queries = [];

  // build all native token queries
  const nativeTokenQueries = validRankings.map(ranking =>
    createNativeTokenQuery(moduleType, contractAddress, chainId, abi, ranking, userAddress),
  );
  queries.push(...nativeTokenQueries);

  // build all ERC20 token queries if we have token addresses
  if (tokenAddresses.length > 0) {
    for (const ranking of validRankings) {
      const erc20Queries = tokenAddresses.map(tokenAddress =>
        createERC20TokenQuery(moduleType, contractAddress, chainId, abi, ranking, tokenAddress, userAddress),
      );
      queries.push(...erc20Queries);
    }
  }

  if (queries.length === 0) return [];

  try {
    return await readContracts(config, {
      contracts: queries,
    });
  } catch (error) {
    console.error("Error fetching releasable rewards:", error);
    return [];
  }
}

/**
 * Prepares rewards fetching
 */
export const prepareRewardsFetching = async (
  params: RewardsParams & {
    contestChainName: string;
  },
) => {
  const { rankings, contractAddress, chainId, abi, contestChainName, version, creatorAddress } = params;

  if (!rankings.length) {
    return { validRankings: [], tiedRankings: [], tokenAddresses: [], tokenInfo: {} };
  }

  const tokenAddresses = await fetchTokenAddresses(contractAddress, contestChainName);
  const { validRankings, tiedRankings } = await validateRankings(
    rankings,
    contractAddress,
    chainId,
    abi,
    version,
    creatorAddress,
  );

  if (!validRankings.length && !tiedRankings.length) {
    return { validRankings: [], tiedRankings: [], tokenAddresses: [], tokenInfo: {} };
  }

  // get token symbols and decimals for ERC20 tokens (if any) in parallel
  const [symbols, decimals] =
    tokenAddresses.length > 0
      ? await Promise.all([
          getTokenSymbolBatch(tokenAddresses, chainId),
          getTokenDecimalsBatch(tokenAddresses, chainId),
        ])
      : [{}, {}];

  return { validRankings, tiedRankings, tokenAddresses, tokenInfo: { symbols, decimals } };
};
