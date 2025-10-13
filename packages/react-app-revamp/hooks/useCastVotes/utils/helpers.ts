import { formatEther } from "viem";

export const calculateChargeAmount = (amountOfVotes: number, currentPricePerVoteRaw: bigint): bigint => {
  const totalCost = BigInt(amountOfVotes) * currentPricePerVoteRaw;

  return totalCost;
};

export const formatChargeAmount = (amount: bigint): string => {
  return formatEther(amount);
};
