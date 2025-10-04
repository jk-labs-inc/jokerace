import { JK_LABS_SPLIT_DESTINATION_DEFAULT } from "@hooks/useDeployContest";
import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";

/**
 * Creates a map of function names to their result values from contract calls (before we were relying on index and now we are relying on function name, check later if we need to change it back)
 */
export function createResultGetter(contracts: any[], results: any[]) {
  const functionNameToIndex = new Map<string, number>();
  contracts.forEach((contract, index) => {
    functionNameToIndex.set(contract.functionName, index);
  });

  const getResultByName = (functionName: string): any => {
    const index = functionNameToIndex.get(functionName);
    if (index !== undefined && results[index]) {
      return results[index].result;
    }
    return undefined;
  };

  return getResultByName;
}

/**
 * Determines the split fee destination type based on the split fee destination, percentage to creator, creator wallet address, and rewards module address
 *
 * @param splitFeeDestination
 * @param percentageToCreator
 * @param creatorWalletAddress
 * @param rewardsModuleAddress
 * @returns SplitFeeDestinationType
 */
export function determineSplitFeeDestination(
  splitFeeDestination: string,
  percentageToCreator: number,
  creatorWalletAddress: string,
  rewardsModuleAddress?: string,
): SplitFeeDestinationType {
  if (splitFeeDestination === JK_LABS_SPLIT_DESTINATION_DEFAULT || percentageToCreator === 0) {
    return SplitFeeDestinationType.NoSplit;
  }

  if (splitFeeDestination === creatorWalletAddress) {
    return SplitFeeDestinationType.CreatorWallet;
  }

  if (rewardsModuleAddress && splitFeeDestination === rewardsModuleAddress) {
    return SplitFeeDestinationType.RewardsPool;
  }

  return SplitFeeDestinationType.AnotherWallet;
}
