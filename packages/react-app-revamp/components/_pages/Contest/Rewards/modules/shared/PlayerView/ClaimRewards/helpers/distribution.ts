import { Distribution } from "@components/_pages/Contest/Rewards/types";

/**
 * Combines claimable and claimed distributions, removing duplicates and sorting by rank
 */
export const combineDistributions = (claimable: Distribution[], claimed: Distribution[]) => {
  const combined = [...claimable];

  claimed.forEach(claimedDist => {
    const existingIndex = combined.findIndex(dist => dist.rank === claimedDist.rank);
    if (existingIndex === -1) {
      combined.push(claimedDist);
    }
  });

  return combined.sort((a, b) => a.rank - b.rank);
};
