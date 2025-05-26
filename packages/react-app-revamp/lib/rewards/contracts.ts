import { chains, config } from "@config/wagmi";
import { getRewardsModuleContractVersion } from "@helpers/getRewardsModuleContractVersion";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import getVoterRewardsModuleContractVersion from "@helpers/getVoterRewardsModuleContractVersion";
import { ContractConfig } from "@hooks/useContest";
import { RewardsParams } from "@hooks/useUserRewards";
import { getBalance, readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi, Address, erc20Abi, formatUnits } from "viem";
import { fetchTokenAddresses, getTokenAddresses } from "./database";
import {
  ContractQuery,
  ModuleType,
  RewardsModuleInfo,
  TokenData,
  TotalRewardsData,
  VOTER_REWARDS_VERSION,
} from "./types";
import { createERC20TokenQuery, createNativeTokenQuery } from "./utils";

//TODO: refactor this to a more pieces of data (such as core like getRewardsModule info to be in a separate contract folder)
//TODO: add try/catch on all?

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
  version: string,
  creatorAddress?: `0x${string}`,
): Promise<{ validRankings: number[]; tiedRankings: number[] }> => {
  if (!rankings.length) return { validRankings: [], tiedRankings: [] };

  // check if this is an older version (before VOTER_REWARDS_VERSION)
  if (compareVersions(version, VOTER_REWARDS_VERSION) < 0) {
    // for older versions, use getAddressToPayOut
    const addressResults = await readContracts(config, {
      contracts: rankings.map(ranking => ({
        address: contractAddress,
        chainId,
        abi,
        functionName: "getAddressToPayOut",
        args: [BigInt(ranking)],
      })),
    });

    const validRankings: number[] = [];
    const tiedRankings: number[] = [];

    for (let i = 0; i < rankings.length; i++) {
      const payoutAddress = addressResults[i]?.result as `0x${string}` | undefined;
      if (payoutAddress !== undefined) {
        //TODO: if creator participated, it isn't a tie, just think about this
        if (payoutAddress.toLowerCase() === creatorAddress?.toLowerCase()) {
          tiedRankings.push(rankings[i]);
        } else {
          validRankings.push(rankings[i]);
        }
      }
    }

    return { validRankings, tiedRankings };
  }

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
  const tiedRankings: number[] = [];

  for (let i = 0; i < rankings.length; i++) {
    const proposalId = proposalIdResults[i]?.result as bigint | undefined;
    if (proposalId !== undefined) {
      if (proposalId === 0n) {
        tiedRankings.push(rankings[i]);
      } else {
        validRankings.push(rankings[i]);
      }
    }
  }

  return { validRankings, tiedRankings };
};

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

/**
 * Fetches total rewards for a rewards module
 * @param rewardsModuleAddress address of the rewards module
 * @param rewardsModuleAbi ABI of the rewards module
 * @param chainId chain ID
 * @returns total rewards data (native and erc20 tokens)
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
  const nativeBalance = await getBalance(config, {
    address: rewardsModuleAddress,
    chainId,
  });

  let nativeTotalReleased = 0n;
  const tokensData: Record<string, TokenData> = {};

  try {
    const chain = chains.find(chain => chain.id === chainId);
    if (!chain) {
      console.warn(`Chain with ID ${chainId} not found, using only native rewards`);
    } else {
      const networkName = chain.name.toLowerCase();
      const tokenAddresses = (await getTokenAddresses(rewardsModuleAddress, networkName)) as Address[];

      const contractCalls: ContractQuery[] = [
        {
          address: rewardsModuleAddress,
          abi: rewardsModuleAbi,
          functionName: "totalReleased",
          chainId,
          args: [],
        },
      ];

      // Add ERC20 token calls if we have token addresses
      if (tokenAddresses && tokenAddresses.length > 0) {
        tokenAddresses.forEach(tokenAddress => {
          contractCalls.push(
            {
              address: rewardsModuleAddress,
              abi: rewardsModuleAbi,
              functionName: "erc20TotalReleased",
              chainId,
              args: [tokenAddress],
            },
            {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "symbol",
              chainId,
              args: [],
            },
            {
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "decimals",
              chainId,
              args: [],
            },
          );
        });
      }

      const contractResults = await readContracts(config, {
        contracts: contractCalls,
      });

      nativeTotalReleased = (contractResults[0].result as bigint) || 0n;
      const nativeTotal = nativeBalance.value + nativeTotalReleased;

      if (tokenAddresses && tokenAddresses.length > 0) {
        const tokenBalances = await Promise.all(
          tokenAddresses.map(tokenAddress =>
            getBalance(config, {
              address: rewardsModuleAddress,
              token: tokenAddress,
              chainId,
            }),
          ),
        );

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

          const tokenTotalReleased = (tokenTotalReleasedResult.result as bigint) || 0n;
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
  } catch (error) {
    console.error("Error fetching token data:", error);
  }

  const nativeTotal = nativeBalance.value + nativeTotalReleased;
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

/**
 * Fetches total rewards for a specific ranking in a rewards module
 * @param rewardsModuleAddress address of the rewards module
 * @param rewardsModuleAbi ABI of the rewards module
 * @param chainId chain ID
 * @param ranking the ranking to fetch rewards for
 * @returns total rewards data for the specific ranking (native and erc20 tokens)
 */
export async function fetchTotalRewardsForRank({
  rewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
  ranking,
}: {
  rewardsModuleAddress: Address;
  rewardsModuleAbi: Abi;
  chainId: number;
  ranking: number;
}): Promise<TotalRewardsData> {
  try {
    const totalRewards = await fetchTotalRewards({
      rewardsModuleAddress,
      rewardsModuleAbi,
      chainId,
    });

    const [rankShareResult, totalSharesResult] = await Promise.all([
      readContract(config, {
        address: rewardsModuleAddress,
        abi: rewardsModuleAbi,
        functionName: "shares",
        chainId,
        args: [BigInt(ranking)],
      }),
      readContract(config, {
        address: rewardsModuleAddress,
        abi: rewardsModuleAbi,
        functionName: "totalShares",
        chainId,
        args: [],
      }),
    ]);

    const rankShare = rankShareResult as bigint;
    const totalShares = totalSharesResult as bigint;

    if (rankShare === 0n || totalShares === 0n) {
      return {
        native: {
          value: 0n,
          formatted: "0",
          symbol: totalRewards.native.symbol,
          decimals: totalRewards.native.decimals,
        },
        tokens: {},
      };
    }

    const nativeRankReward = (totalRewards.native.value * rankShare) / totalShares;

    const rankTokensData: Record<string, TokenData> = {};

    for (const [tokenAddress, tokenData] of Object.entries(totalRewards.tokens)) {
      const tokenRankReward = (tokenData.value * rankShare) / totalShares;
      rankTokensData[tokenAddress] = {
        value: tokenRankReward,
        formatted: formatUnits(tokenRankReward, tokenData.decimals),
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
      };
    }

    return {
      native: {
        value: nativeRankReward,
        formatted: formatUnits(nativeRankReward, totalRewards.native.decimals),
        symbol: totalRewards.native.symbol,
        decimals: totalRewards.native.decimals,
      },
      tokens: rankTokensData,
    };
  } catch (error) {
    console.error("Error fetching rewards for ranking:", error);

    return {
      native: {
        value: 0n,
        formatted: "0",
        symbol: "ETH",
        decimals: 18,
      },
      tokens: {},
    };
  }
}
