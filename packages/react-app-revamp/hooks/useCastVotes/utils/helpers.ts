import { VoteType, Charge } from "@hooks/useDeployContest/types";
import { parseEther, formatEther } from "viem";

export const calculateChargeAmount = (amountOfVotes: number, currentPricePerVote: string): bigint | undefined => {
  const pricePerVoteInWei = parseEther(currentPricePerVote);
  const totalCost = BigInt(amountOfVotes) * pricePerVoteInWei;

  return totalCost;
};

export const formatChargeAmount = (amount: number): number => {
  return Number(formatEther(BigInt(amount)));
};
