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

export interface BaseContestData {
  created_at: string;
  end_at: string;
  address: string;
  author_address: string;
  network_name: string;
  vote_start_at: string;
  featured: boolean;
}

export interface ProcessedContest extends BaseContestData {
  title: string;
  isCanceled: boolean;
}

export interface ContestsResponse {
  data: ProcessedContest[];
  count: number;
}

export interface ContestWithTotalRewards {
  contestAddress: string;
  chain: string;
  hasRewards: boolean;
  rewardsData: TotalRewardsData | null;
}
