import { Distribution, Reward } from "@components/_pages/Contest/Rewards/types";

export const groupRewardsByRank = (
  claimableDistributions: Distribution[],
  claimedDistributions: Distribution[],
): Map<number, { reward: Reward; claimed: boolean }[]> => {
  const groupedByRank = new Map<number, { reward: Reward; claimed: boolean }[]>();

  claimableDistributions.forEach(d => {
    if (!groupedByRank.has(d.rank)) groupedByRank.set(d.rank, []);
    d.rewards.forEach(reward => {
      groupedByRank.get(d.rank)!.push({ reward, claimed: false });
    });
  });
  claimedDistributions.forEach(d => {
    if (!groupedByRank.has(d.rank)) groupedByRank.set(d.rank, []);
    d.rewards.forEach(reward => {
      groupedByRank.get(d.rank)!.push({ reward, claimed: true });
    });
  });

  return groupedByRank;
};

export const getSortedRanks = (groupedByRank: Map<number, { reward: Reward; claimed: boolean }[]>): number[] => {
  return Array.from(groupedByRank.keys()).sort((a, b) => a - b);
};
