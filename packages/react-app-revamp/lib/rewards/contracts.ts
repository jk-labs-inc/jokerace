import { config } from "@config/wagmi";
import { getRewardsModuleContractVersion } from "@helpers/getRewardsModuleContractVersion";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import getVoterRewardsModuleContractVersion from "@helpers/getVoterRewardsModuleContractVersion";
import { ContractConfig } from "@hooks/useContest";
import { RewardsParams } from "@hooks/useUserRewards";
import { getBalance, readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi, Address, erc20Abi, formatUnits } from "viem";
import { fetchTokenAddresses, getTokenAddresses } from "./database";
import { ModuleType, RewardsModuleInfo, TokenData, TotalRewardsData, VOTER_REWARDS_VERSION } from "./types";
import { createERC20TokenQuery, createNativeTokenQuery } from "./utils";
import { chains } from "@config/wagmi";

//TODO: refactor this to a more pieces of data (such as core like getRewardsModule info to be in a separate contract folder)

/**
 * Gets information about the rewards module
 * @param rewardsModuleAddress address of the rewards module
 * @param chainId chain ID
 * @returns rewards module information
 */
export async function getRewardsModuleInfo(rewardsModuleAddress: string, chainId: number): Promise<RewardsModuleInfo> {
  try {
    const { abi, version } = await getRewardsModuleVersionInfo(rewardsModuleAddress, chainId);

    if (!abi) return { abi: null, moduleType: null };

    let finalAbi: Abi | null = abi as Abi;

    if (compareVersions(version, VOTER_REWARDS_VERSION) < 0) {
      return { abi: finalAbi, moduleType: ModuleType.AUTHOR_REWARDS };
    }

    const moduleType = await getModuleType(rewardsModuleAddress, abi as Abi, chainId);

    if (moduleType === ModuleType.VOTER_REWARDS) {
      finalAbi = (await getVoterRewardsModuleContractVersion(rewardsModuleAddress, chainId)) as Abi;
    }

    return {
      abi: finalAbi,
      moduleType: moduleType as ModuleType,
    };
  } catch (error) {
    console.error("Error in getRewardsModuleInfo:", error);
    return { abi: null, moduleType: null };
  }
}

/**
 * Gets rewards module version information
 * @param address address of the rewards module
 * @param chainId chain ID
 * @returns version information
 */
export async function getRewardsModuleVersionInfo(address: string, chainId: number) {
  return await getRewardsModuleContractVersion(address, chainId);
}

/**
 * Gets the rewards module address for a contest
 * @param contractConfig contest contract config
 * @returns rewards module address
 */
export async function getRewardsModuleAddress(contractConfig: ContractConfig): Promise<string | null> {
  const hasRewardsModule = contractConfig.abi?.some((el: { name: string }) => el.name === "officialRewardsModule");

  if (!hasRewardsModule) return null;

  const address = (await readContract(config, {
    ...contractConfig,
    functionName: "officialRewardsModule",
    args: [],
  })) as string;

  return address === "0x0000000000000000000000000000000000000000" ? null : address;
}

/**
 * Gets the module type
 * @param address address of the rewards module
 * @param abi ABI of the rewards module
 * @param chainId chain ID
 * @returns module type
 */
export async function getModuleType(address: string, abi: Abi, chainId: number): Promise<string> {
  return (await readContract(config, {
    address: address as `0x${string}`,
    abi,
    functionName: "MODULE_TYPE",
    chainId,
    args: [],
  })) as string;
}

/**
 * Fetches releasable rewards
 * @param moduleType type of the rewards module
 * @param validRankings valid rankings
 * @param tokenAddresses token addresses
 * @param contractAddress contract address
 * @param chainId chain ID
 * @param abi ABI of the contract
 * @param voterAddress voter address
 * @returns releasable rewards
 */
export async function fetchReleasableRewards(
  moduleType: ModuleType,
  validRankings: number[],
  tokenAddresses: `0x${string}`[],
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  voterAddress?: `0x${string}`,
): Promise<any[]> {
  const queries = [];

  // build all native token queries
  const nativeTokenQueries = validRankings.map(ranking =>
    createNativeTokenQuery(moduleType, contractAddress, chainId, abi, ranking, voterAddress),
  );
  queries.push(...nativeTokenQueries);

  // build all ERC20 token queries if we have token addresses
  if (tokenAddresses.length > 0) {
    for (const ranking of validRankings) {
      const erc20Queries = tokenAddresses.map(tokenAddress =>
        createERC20TokenQuery(moduleType, contractAddress, chainId, abi, ranking, tokenAddress, voterAddress),
      );
      queries.push(...erc20Queries);
    }
  }

  if (queries.length === 0) return [];

  return await readContracts(config, {
    contracts: queries,
  });
}

/**
 * Creates a contract read batch for native token data
 */
export const createNativeTokenReadBatch = (
  moduleType: ModuleType,
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  validRankings: number[],
  voterAddress: `0x${string}`,
  functionName: string,
) => {
  return readContracts(config, {
    contracts: validRankings.map(ranking => ({
      address: contractAddress,
      chainId,
      abi,
      functionName,
      args: moduleType === ModuleType.VOTER_REWARDS ? [voterAddress, BigInt(ranking)] : [BigInt(ranking)],
    })),
  });
};

/**
 * Creates a contract read for ERC20 token data
 */
export const createERC20TokenRead = (
  moduleType: ModuleType,
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  tokenAddress: `0x${string}`,
  ranking: number,
  voterAddress: `0x${string}`,
  functionName: string,
) => {
  return readContracts(config, {
    contracts: [
      {
        address: contractAddress,
        chainId,
        abi,
        functionName,
        args:
          moduleType === ModuleType.VOTER_REWARDS
            ? [tokenAddress, voterAddress, BigInt(ranking)]
            : [tokenAddress, BigInt(ranking)],
      },
    ],
  });
};

/**
 * Validates rankings
 */
export const validateRankings = async (
  rankings: number[],
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
): Promise<number[]> => {
  if (!rankings.length) return [];

  const proposalIdResults = await readContracts(config, {
    contracts: rankings.map(ranking => ({
      address: contractAddress,
      chainId,
      abi,
      functionName: "getProposalIdOfRanking",
      args: [BigInt(ranking)],
    })),
  });

  const validRankings: number[] = [];
  for (let i = 0; i < rankings.length; i++) {
    const proposalId = proposalIdResults[i]?.result as bigint | undefined;
    if (proposalId && proposalId !== 0n) {
      validRankings.push(rankings[i]);
    }
  }

  return validRankings;
};

/**
 * Prepares rewards fetching
 */
export const prepareRewardsFetching = async (
  params: RewardsParams & {
    contestChainName: string;
  },
) => {
  const { rankings, contractAddress, chainId, abi, contestChainName } = params;

  if (!rankings.length) {
    return { validRankings: [], tokenAddresses: [], tokenInfo: {} };
  }

  const tokenAddresses = await fetchTokenAddresses(contractAddress, contestChainName);
  const validRankings = await validateRankings(rankings, contractAddress, chainId, abi);

  if (!validRankings.length) {
    return { validRankings: [], tokenAddresses: [], tokenInfo: {} };
  }

  // get token symbols and decimals for ERC20 tokens (if any) in parallel
  const [symbols, decimals] =
    tokenAddresses.length > 0
      ? await Promise.all([
          getTokenSymbolBatch(tokenAddresses, chainId),
          getTokenDecimalsBatch(tokenAddresses, chainId),
        ])
      : [{}, {}];

  return { validRankings, tokenAddresses, tokenInfo: { symbols, decimals } };
};

/**
 * Fetches total rewards for a rewards module
 * @param rewardsModuleAddress address of the rewards module
 * @param rewardsModuleAbi ABI of the rewards module
 * @param chainId chain ID
 * @returns total rewards data
 */
export async function fetchTotalRewards({
  rewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
}: {
  rewardsModuleAddress: Address;
  rewardsModuleAbi: Abi;
  chainId: number;
}): Promise<TotalRewardsData> {
  // Get native token balance first
  const nativeBalance = await getBalance(config, {
    address: rewardsModuleAddress,
    chainId,
  });

  // Initialize with native token data
  let nativeTotalReleased = 0n;
  const nativeTotal = nativeBalance.value + nativeTotalReleased;
  const tokensData: Record<string, TokenData> = {};

  try {
    // Find the chain name from the chainId
    const chain = chains.find(chain => chain.id === chainId);
    if (!chain) {
      console.warn(`Chain with ID ${chainId} not found, using only native rewards`);
    } else {
      // Get network name from chain and fetch token addresses
      const networkName = chain.name.toLowerCase();
      const tokenAddresses = (await getTokenAddresses(rewardsModuleAddress, networkName)) as Address[];

      // Only proceed with token data if addresses are available
      if (tokenAddresses && tokenAddresses.length > 0) {
        // Prepare contract calls for batch execution
        const contractCalls = [
          {
            address: rewardsModuleAddress,
            abi: rewardsModuleAbi,
            functionName: "totalReleased",
            chainId,
          },
          ...tokenAddresses.flatMap(tokenAddress => [
            {
              address: rewardsModuleAddress,
              abi: rewardsModuleAbi,
              functionName: "erc20TotalReleased",
              args: [tokenAddress],
              chainId,
            },
            {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "symbol",
              chainId,
            },
            {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "decimals",
              chainId,
            },
          ]),
        ];

        const contractResults = await readContracts(config, {
          contracts: contractCalls,
        });

        // Update native value with released amount
        nativeTotalReleased = contractResults[0].result as bigint;
        const updatedNativeTotal = nativeBalance.value + nativeTotalReleased;

        // Get token balances in parallel
        const tokenBalances = await Promise.all(
          tokenAddresses.map(tokenAddress =>
            getBalance(config, {
              address: rewardsModuleAddress,
              token: tokenAddress,
              chainId,
            }),
          ),
        );

        // Process token data
        for (let i = 0; i < tokenAddresses.length; i++) {
          const tokenAddress = tokenAddresses[i];
          const resultBaseIndex = 1 + i * 3;

          const tokenTotalReleasedResult = contractResults[resultBaseIndex];
          const symbolResult = contractResults[resultBaseIndex + 1];
          const decimalsResult = contractResults[resultBaseIndex + 2];

          if (
            tokenTotalReleasedResult.status === "failure" ||
            symbolResult.status === "failure" ||
            decimalsResult.status === "failure"
          ) {
            const error = [tokenTotalReleasedResult, symbolResult, decimalsResult].find(
              r => r.status === "failure",
            )?.error;
            console.error(`Failed to get token data for ${tokenAddress}:`, error);
            continue;
          }

          const tokenTotalReleased = tokenTotalReleasedResult.result as bigint;
          const symbol = symbolResult.result as string;
          const decimals = decimalsResult.result as number;
          const tokenBalance = tokenBalances[i];

          const tokenTotal = tokenBalance.value + tokenTotalReleased;

          tokensData[tokenAddress as string] = {
            value: tokenTotal,
            formatted: formatUnits(tokenTotal, decimals),
            symbol,
            decimals,
          };
        }

        return {
          native: {
            value: updatedNativeTotal,
            formatted: formatUnits(updatedNativeTotal, 18),
            symbol: nativeBalance.symbol,
            decimals: 18,
          },
          tokens: tokensData,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching token data:", error);
  }

  return {
    native: {
      value: nativeTotal,
      formatted: formatUnits(nativeTotal, 18),
      symbol: nativeBalance.symbol || "ETH",
      decimals: 18,
    },
    tokens: tokensData,
  };
}
