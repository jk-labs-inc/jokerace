import { addressRegex } from "@helpers/regex";
import { SplitFeeDestinationType } from "@hooks/useDeployContest/types";

export const validateCostToPropose = (value: number | null, minCostToPropose: number): string | null => {
  if (value === null || value < minCostToPropose) {
    return `must be at least ${minCostToPropose}`;
  }
  return null;
};

export const validateCostToVote = (value: number | null, minCostToVote: number): string | null => {
  if (value === null || value < minCostToVote) {
    return `must be at least ${minCostToVote}`;
  }
  return null;
};

export const validateSplitFeeDestination = (
  value: { type: SplitFeeDestinationType; address?: string | null } | null,
): string | null => {
  if (!value) {
    return "split fee destination is required";
  }

  const isCreatorWalletOrNoSplit =
    value.type === SplitFeeDestinationType.CreatorWallet || value.type === SplitFeeDestinationType.NoSplit;

  if (!isCreatorWalletOrNoSplit) {
    const isValidAddress = addressRegex.test(value.address ?? "");
    if (!isValidAddress) {
      return "invalid address";
    }
  }

  return null;
};

export const validateSplitFeeDestinationAddress = (
  value: { type: SplitFeeDestinationType; address?: string | null } | null,
): string | null => {
  if (!value) {
    return "split fee destination is required";
  }

  const isCreatorWalletOrNoSplit =
    value.type === SplitFeeDestinationType.CreatorWallet || value.type === SplitFeeDestinationType.NoSplit;

  if (!isCreatorWalletOrNoSplit && !addressRegex.test(value.address ?? "")) {
    return "invalid address";
  }

  return null;
};

export const validateStartAndEndPrice = (start: number | null, end: number | null): string | null => {
  if (start === null || end === null || end <= start) {
    return "end price must be greater than start price";
  }
  return null;
};
