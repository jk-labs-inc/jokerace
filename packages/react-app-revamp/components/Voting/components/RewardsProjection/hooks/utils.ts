import { formatBalance } from "@helpers/formatBalance";
import { calculateEndPrice } from "lib/priceCurve";
import { formatEther, parseEther } from "viem";

interface CalculateWinUpToParams {
  currentPricePerVote: bigint;
  costToVoteAtStart: bigint;
  spendingAmount: number;
  multiple: number;
  percentageToCreator: number;
  firstPlaceSharePercentage: number;
  submissionsCount: number;
}

export const calculateVotingRewardsProjection = ({
  currentPricePerVote,
  costToVoteAtStart,
  spendingAmount,
  multiple,
  percentageToCreator,
  firstPlaceSharePercentage,
  submissionsCount,
}: CalculateWinUpToParams): string => {
  const spendingAmountWei = parseEther(spendingAmount.toString());

  // Calculate number of votes user is buying at current price (in wei)
  const numberOfVotes = Math.floor(Number(spendingAmountWei) / Number(currentPricePerVote));

  // Calculate final price per vote (end of exponential curve) - returns bigint in wei
  const finalPricePerVoteWei = calculateEndPrice(Number(costToVoteAtStart), multiple);

  // Convert final price to ETH for calculation
  const finalPricePerVote = Number(formatEther(finalPricePerVoteWei));

  // Formula: (1st place %) × (% to pool) × (final price per vote) × (votes) × (total entries)
  const percentToPool = percentageToCreator / 100;
  const firstPlaceShare = firstPlaceSharePercentage / 100;

  const totalPoolProjection = finalPricePerVote * numberOfVotes * submissionsCount * percentToPool * firstPlaceShare;

  return formatBalance(totalPoolProjection.toString());
};

export const validateVotingRewardsProjectionData = (
  percentageToCreator: number,
  firstPlaceSharePercentage: number,
  costToVote: bigint,
): boolean => {
  return Boolean(percentageToCreator && firstPlaceSharePercentage && costToVote > 0n);
};
