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
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  powerType: string;
  powerValue: number;
  timestamp: number;
};

export type SubmissionRequirements = {
  type: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  timestamp: number;
};

export type Charge = {
  percentageToCreator: number;
  type: {
    costToPropose: number;
    costToVote: number;
  };
  error?: boolean;
};
