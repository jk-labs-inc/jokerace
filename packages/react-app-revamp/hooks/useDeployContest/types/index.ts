export const MAX_SUBMISSIONS_PER_CONTEST = 1000;
export const MAX_ALLOWED_SUBMISSIONS_PER_USER = 1000;
export const DEFAULT_ALLOWED_SUBMISSIONS_PER_USER = 8;

export type Recipient = {
  address: string;
  numVotes: string;
};

export enum VoteType {
  PerVote = "PerVote",
  PerTransaction = "PerTransaction",
}

export type Charge = {
  percentageToCreator: number;
  voteType: VoteType;
  type: {
    costToPropose: number;
    costToVote: number;
    costToVoteStartPrice?: number;
    costToVoteEndPrice?: number;
  };
  error?: boolean;
};

export enum PriceCurveType {
  Flat = "Flat",
  Exponential = "Exponential",
}

export interface PriceCurve {
  type: PriceCurveType;
  multiple: number;
}

export interface ContestValues {
  anyoneCanSubmit: number;
  datetimeOpeningSubmissions: Date;
  datetimeOpeningVoting: Date;
  datetimeClosingVoting: Date;
  title: string;
  type: string;
  prompt: string;
  contractAddress: string;
  networkName: string;
  voting_requirements: any;
  cost_to_propose: number;
  cost_to_vote: number;
  percentage_to_creator: number;
  authorAddress?: string;
  featured?: boolean;
}
