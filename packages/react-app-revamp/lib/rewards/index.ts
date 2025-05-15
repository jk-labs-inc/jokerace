import { Distribution } from "@components/_pages/Contest/Rewards/types";
import { RewardsParams } from "@hooks/useUserRewards";
import {
  createERC20TokenRead,
  createNativeTokenReadBatch,
  fetchReleasableRewards,
  prepareRewardsFetching,
} from "./contracts";
import { ModuleType } from "./types";
import { addRewardToDistribution, processERC20TokenRewards, processNativeTokenRewards } from "./utils";

export * from "./database";
export * from "./types";

/**
 * Fetches claimed (released) rewards
 */
export async function fetchClaimedRewards({
  moduleType,
  contractAddress,
  chainId,
  abi,
  voterAddress,
  rankings,
  contestChainName,
  nativeTokenInfo,
}: RewardsParams & {
  contestChainName: string;
  nativeTokenInfo: { symbol: string; decimals: number };
}): Promise<Distribution[]> {
  const { validRankings, tokenAddresses, tokenInfo } = await prepareRewardsFetching({
    moduleType,
    contractAddress,
    chainId,
    abi,
    voterAddress,
    rankings,
    contestChainName,
  });

  if (!validRankings.length) return [];

  const distributionsMap = new Map<number, Distribution>();

  const nativeFunctionName = moduleType === ModuleType.VOTER_REWARDS ? "releasedToVoter" : "released";
  const nativeReleasedResults = await createNativeTokenReadBatch(
    moduleType,
    contractAddress,
    chainId,
    abi,
    validRankings,
    voterAddress,
    nativeFunctionName,
  );

  for (let i = 0; i < validRankings.length; i++) {
    const ranking = validRankings[i];
    const nativeAmount = nativeReleasedResults[i]?.result as bigint | undefined;

    addRewardToDistribution(
      distributionsMap,
      ranking,
      nativeAmount || 0n,
      nativeTokenInfo.symbol,
      nativeTokenInfo.decimals,
    );
  }

  // fetch and process ERC20 released rewards if we have token addresses
  if (tokenAddresses.length > 0) {
    const erc20FunctionName = moduleType === ModuleType.VOTER_REWARDS ? "erc20ReleasedToVoter" : "erc20Released";

    for (const ranking of validRankings) {
      for (const tokenAddress of tokenAddresses) {
        const erc20ReleasedResult = await createERC20TokenRead(
          moduleType,
          contractAddress,
          chainId,
          abi,
          tokenAddress,
          ranking,
          voterAddress,
          erc20FunctionName,
        );

        const amount = erc20ReleasedResult[0]?.result as bigint | undefined;

        addRewardToDistribution(
          distributionsMap,
          ranking,
          amount || 0n,
          tokenInfo.symbols?.[tokenAddress] || "unknown",
          tokenInfo.decimals?.[tokenAddress] || 18,
        );
      }
    }
  }

  return Array.from(distributionsMap.values());
}

/**
 * Fetches claimable rewards
 */
export async function fetchClaimableRewards({
  moduleType,
  contractAddress,
  chainId,
  abi,
  voterAddress,
  rankings,
  contestChainName,
  nativeTokenInfo,
}: RewardsParams & {
  contestChainName: string;
  nativeTokenInfo: { symbol: string; decimals: number };
}): Promise<Distribution[]> {
  const { validRankings, tokenAddresses, tokenInfo } = await prepareRewardsFetching({
    moduleType,
    contractAddress,
    chainId,
    abi,
    voterAddress,
    rankings,
    contestChainName,
  });

  if (!validRankings.length) return [];

  const rewardResults = await fetchReleasableRewards(
    moduleType,
    validRankings,
    tokenAddresses,
    contractAddress,
    chainId,
    abi,
    voterAddress,
  );

  const distributionsMap = new Map<number, Distribution>();

  processNativeTokenRewards(validRankings, rewardResults, nativeTokenInfo, distributionsMap);
  processERC20TokenRewards(
    validRankings,
    tokenAddresses,
    rewardResults,
    tokenInfo.symbols || {},
    tokenInfo.decimals || {},
    distributionsMap,
  );

  return Array.from(distributionsMap.values());
}
