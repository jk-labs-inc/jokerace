import { TotalRewardsData } from "lib/rewards/types";

export interface ContestReward {
  contestAddress: string;
  chain: string;
  token: {
    symbol: string;
    value: string;
  } | null;
  winners: number;
  numberOfTokens: number;
  rewardsPaidOut: boolean;
}

export interface Contest {
  created_at: string;
  start_at: string | null;
  end_at: string | null;
  address: string | null;
  author_address: string | null;
  network_name: string | null;
  vote_start_at: string | null;
  featured: boolean | null;
  title: string | null;
  type: string | null;
  votingMerkleRoot: string | null;
  submissionMerkleRoot: string | null;
  hidden: boolean;
  voting_requirements: Record<string, any> | null;
  submission_requirements: Record<string, any> | null;
  cost_to_propose: number | null;
  percentage_to_propose: number | null;
  cost_to_vote: number | null;
  isCanceled: boolean;
}

export interface ContestWithTotalRewards {
  contestAddress: string;
  chain: string;
  hasRewards: boolean;
  rewardsData: TotalRewardsData | null;
}
