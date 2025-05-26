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
  creatorAddress,
  contestChainName,
  nativeTokenInfo,
  version,
}: RewardsParams & {
  contestChainName: string;
  nativeTokenInfo: { symbol: string; decimals: number };
}): Promise<Distribution[]> {
  const { validRankings, tiedRankings, tokenAddresses, tokenInfo } = await prepareRewardsFetching({
    moduleType,
    contractAddress,
    chainId,
    abi,
    voterAddress,
    rankings,
    contestChainName,
    version,
    creatorAddress,
  });

  const distributionsMap = new Map<number, Distribution>();
  const isCreator = creatorAddress && voterAddress === creatorAddress;

  // Process valid rankings
  if (validRankings.length > 0) {
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
        "native",
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
            tokenAddress,
            tokenInfo.symbols?.[tokenAddress] || "unknown",
            tokenInfo.decimals?.[tokenAddress] || 18,
          );
        }
      }
    }
  }

  // Process tied rankings if user is the creator
  if (isCreator && tiedRankings.length > 0) {
    // For tied rankings, we use "released" instead of "releasedToVoter" for the creator
    const nativeReleasedResults = await createNativeTokenReadBatch(
      ModuleType.AUTHOR_REWARDS, // Force author rewards mode to use released instead of releasedToVoter
      contractAddress,
      chainId,
      abi,
      tiedRankings,
      voterAddress,
      "released", // Use released for creator
    );

    for (let i = 0; i < tiedRankings.length; i++) {
      const ranking = tiedRankings[i];
      const nativeAmount = nativeReleasedResults[i]?.result as bigint | undefined;

      addRewardToDistribution(
        distributionsMap,
        ranking,
        nativeAmount || 0n,
        "native",
        nativeTokenInfo.symbol,
        nativeTokenInfo.decimals,
      );
    }

    // fetch and process ERC20 released rewards for tied rankings if we have token addresses
    if (tokenAddresses.length > 0) {
      for (const ranking of tiedRankings) {
        for (const tokenAddress of tokenAddresses) {
          const erc20ReleasedResult = await createERC20TokenRead(
            ModuleType.AUTHOR_REWARDS, // Force author rewards mode to use erc20Released instead of erc20ReleasedToVoter
            contractAddress,
            chainId,
            abi,
            tokenAddress,
            ranking,
            voterAddress,
            "erc20Released", // Use erc20Released for creator
          );

          const amount = erc20ReleasedResult[0]?.result as bigint | undefined;

          addRewardToDistribution(
            distributionsMap,
            ranking,
            amount || 0n,
            tokenAddress,
            tokenInfo.symbols?.[tokenAddress] || "unknown",
            tokenInfo.decimals?.[tokenAddress] || 18,
          );
        }
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
  //TODO: rename this to userAddress
  voterAddress,
  rankings,
  creatorAddress,
  version,
  contestChainName,
  nativeTokenInfo,
}: RewardsParams & {
  contestChainName: string;
  nativeTokenInfo: { symbol: string; decimals: number };
}): Promise<Distribution[]> {
  const { validRankings, tiedRankings, tokenAddresses, tokenInfo } = await prepareRewardsFetching({
    moduleType,
    contractAddress,
    chainId,
    abi,
    voterAddress,
    rankings,
    contestChainName,
    version,
  });

  const distributionsMap = new Map<number, Distribution>();
  const isCreator = creatorAddress && voterAddress === creatorAddress;

  if (validRankings.length > 0) {
    const rewardResults = await fetchReleasableRewards(
      moduleType,
      validRankings,
      tokenAddresses,
      contractAddress,
      chainId,
      abi,
      voterAddress,
    );

    processNativeTokenRewards(validRankings, rewardResults, nativeTokenInfo, distributionsMap);
    processERC20TokenRewards(
      validRankings,
      tokenAddresses,
      rewardResults,
      tokenInfo.symbols || {},
      tokenInfo.decimals || {},
      distributionsMap,
    );
  }

  // Process tied rankings if user is the creator
  if (isCreator && tiedRankings.length > 0) {
    // For tied rankings, we use "releasable" instead of "releasableToVoter" for the creator
    const tiedRewardResults = await fetchReleasableRewards(
      ModuleType.AUTHOR_REWARDS, // Force author rewards mode to use releasable instead of releasableToVoter
      tiedRankings,
      tokenAddresses,
      contractAddress,
      chainId,
      abi,
      voterAddress,
    );

    processNativeTokenRewards(tiedRankings, tiedRewardResults, nativeTokenInfo, distributionsMap);
    processERC20TokenRewards(
      tiedRankings,
      tokenAddresses,
      tiedRewardResults,
      tokenInfo.symbols || {},
      tokenInfo.decimals || {},
      distributionsMap,
    );
  }

  return Array.from(distributionsMap.values());
}
