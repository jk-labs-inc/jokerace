import { Distribution, Reward } from "@components/_pages/Contest/Rewards/types";
import { Abi } from "viem";
import { ContractQuery } from "./types";

/*
 * Process native token rewards
 * @param rankings - The rankings to process
 * @param rewardResults - The reward results
 * @param nativeTokenInfo - The native token info
 * @param distributionsMap - The distributions map
 */
export function processNativeTokenRewards(
  rankings: number[],
  rewardResults: any[],
  nativeTokenInfo: { symbol: string; decimals: number },
  distributionsMap: Map<number, Distribution>,
) {
  for (let i = 0; i < rankings.length; i++) {
    const ranking = rankings[i];
    const nativeAmount = rewardResults?.[i]?.result as bigint | undefined;

    if (nativeAmount && nativeAmount > 0n) {
      if (!distributionsMap.has(ranking)) {
        distributionsMap.set(ranking, { rank: ranking, rewards: [] });
      }

      distributionsMap.get(ranking)!.rewards.push({
        value: nativeAmount,
        address: "native",
        symbol: nativeTokenInfo.symbol,
        decimals: nativeTokenInfo.decimals,
      });
    }
  }
}

/*
 * Process ERC20 token rewards
 * @param rankings - The rankings to process
 * @param tokenAddresses - The token addresses
 * @param rewardResults - The reward results
 * @param symbols - The symbols
 * @param distributionsMap - The distributions map
 */
export function processERC20TokenRewards(
  rankings: number[],
  tokenAddresses: `0x${string}`[],
  rewardResults: any[],
  symbols: Record<string, string>,
  decimals: Record<string, number>,
  distributionsMap: Map<number, Distribution>,
) {
  const nativeCallsCount = rankings.length;
  let callIndex = nativeCallsCount;

  for (const ranking of rankings) {
    for (const tokenAddress of tokenAddresses) {
      const amount = rewardResults?.[callIndex]?.result as bigint | undefined;
      callIndex++;

      if (amount && amount > 0n) {
        if (!distributionsMap.has(ranking)) {
          distributionsMap.set(ranking, { rank: ranking, rewards: [] });
        }

        distributionsMap.get(ranking)!.rewards.push({
          value: amount,
          address: tokenAddress,
          symbol: symbols[tokenAddress] || "unknown",
          decimals: decimals[tokenAddress] || 18,
        });
      }
    }
  }
}

/**
 * Create a native token query
 * @param contractAddress - The contract address
 * @param chainId - The chain id
 * @param abi - The abi of the contract
 * @param ranking - The ranking
 * @param userAddress - The user address
 * @param isCreator - The is creator (creator mode)
 * @returns The contract query
 */
export function createNativeTokenQuery(
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  ranking: number,
  userAddress?: `0x${string}`,
  isCreator?: boolean,
): ContractQuery {
  if (isCreator) {
    return {
      address: contractAddress,
      chainId,
      abi,
      functionName: "releasable",
      args: [BigInt(ranking)],
    };
  }

  return {
    address: contractAddress,
    chainId,
    abi,
    functionName: "releasableToVoter",
    args: [userAddress, BigInt(ranking)],
  };
}

/**
 * Create a ERC20 token query
 * @param contractAddress - The contract address
 * @param chainId - The chain id
 * @param abi - The abi of the contract
 * @param ranking - The ranking
 * @param tokenAddress - The token address
 * @param userAddress - The user address
 * @param isCreator - The is creator
 * (creator mode)
 * @returns The contract query
 */
export function createERC20TokenQuery(
  contractAddress: `0x${string}`,
  chainId: number,
  abi: Abi,
  ranking: number,
  tokenAddress: `0x${string}`,
  userAddress?: `0x${string}`,
  isCreator?: boolean,
): ContractQuery {
  if (isCreator) {
    return {
      address: contractAddress,
      chainId,
      abi,
      functionName: "releasable",
      args: [tokenAddress, BigInt(ranking)],
    };
  }

  return {
    address: contractAddress,
    chainId,
    abi,
    functionName: "releasableToVoter",
    args: [tokenAddress, userAddress, BigInt(ranking)],
  };
}

/*
  Add a reward to the distribution map
  @param distributionsMap - The distributions map
  @param ranking - The ranking
  @param amount - The amount
  @param address - The address
  @param decimals - The decimals
*/
export function addRewardToDistribution(
  distributionsMap: Map<number, Distribution>,
  ranking: number,
  amount: bigint,
  address: string,
  symbol: string,
  decimals: number,
) {
  if (amount && amount > 0n) {
    if (!distributionsMap.has(ranking)) {
      distributionsMap.set(ranking, { rank: ranking, rewards: [] });
    }

    distributionsMap.get(ranking)!.rewards.push({
      value: amount,
      address,
      symbol,
      decimals,
    });
  }
}

/*
  Calculate total rewards from distributions
  @param distributions - The distributions
  @returns The total rewards
*/
export function calculateTotalRewards(distributions: Distribution[]): Reward[] {
  return distributions.reduce<Reward[]>((acc, distribution) => {
    for (const reward of distribution.rewards) {
      const existingRewardIndex = acc.findIndex(r => r.address === reward.address);

      if (existingRewardIndex >= 0) {
        acc[existingRewardIndex].value += reward.value;
      } else {
        acc.push({ ...reward });
      }
    }
    return acc;
  }, []);
}
