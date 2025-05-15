import { config } from "@config/wagmi";
import { getRewardsModuleContractVersion } from "@helpers/getRewardsModuleContractVersion";
import { getTokenDecimalsBatch, getTokenSymbolBatch } from "@helpers/getTokenDecimals";
import getVoterRewardsModuleContractVersion from "@helpers/getVoterRewardsModuleContractVersion";
import { ContractConfig } from "@hooks/useContest";
import { readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";
import { fetchTokenAddresses } from "./database";
import { createERC20TokenQuery, createNativeTokenQuery } from "./utils";
import { ModuleType, VOTER_REWARDS_VERSION, RewardsModuleInfo } from "./types";
import { RewardsParams } from "@hooks/useUserRewards";

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
