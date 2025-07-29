import { VoteType, Charge } from "@hooks/useDeployContest/types";
import { parseEther, formatEther } from "viem";

export const calculateChargeAmount = (
  amountOfVotes: number,
  charge: Charge | null,
  currentPricePerVote: string,
): bigint | undefined => {
  if (!charge) return undefined;

  if (charge.voteType === VoteType.PerTransaction) {
    return BigInt(charge.type.costToVote);
  }

  const pricePerVoteInWei = parseEther(currentPricePerVote);
  const totalCost = BigInt(amountOfVotes) * pricePerVoteInWei;

  return totalCost;
};

export const formatChargeAmount = (amount: number): number => {
  return Number(formatEther(BigInt(amount)));
};
