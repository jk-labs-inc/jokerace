import { Recipient } from "lib/merkletree/generateMerkleTree";

export type VotingMerkle = {
  merkleRoot: string;
  voters: Recipient[];
};

export type SubmissionMerkle = {
  merkleRoot: string;
  submitters: Recipient[];
};

export type VotingRequirements = {
  type: string;
  nftType: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  powerType: string;
  powerValue: number;
  timestamp: number;
  name: string;
  symbol: string;
  logo: string;
  nftTokenId?: string;
};

export type SubmissionRequirements = {
  type: string;
  nftType: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  timestamp: number;
  name: string;
  symbol: string;
  logo: string;
  nftTokenId?: string;
};

export enum VoteType {
  PerVote = "PerVote",
  PerTransaction = "PerTransaction",
}

export enum SplitFeeDestinationType {
  CreatorWallet = "CreatorWallet",
  AnotherWallet = "AnotherWallet",
  NoSplit = "NoSplit",
  RewardsPool = "RewardsPool",
}

export type SplitFeeDestination =
  | { type: SplitFeeDestinationType.CreatorWallet; address?: string }
  | { type: SplitFeeDestinationType.AnotherWallet; address?: string }
  | { type: SplitFeeDestinationType.NoSplit; address?: string }
  | { type: SplitFeeDestinationType.RewardsPool; address?: string };

export type Charge = {
  percentageToCreator: number;
  splitFeeDestination: SplitFeeDestination;
  voteType: VoteType;
  type: {
    costToPropose: number;
    costToVote: number;
  };
  error?: boolean;
};
