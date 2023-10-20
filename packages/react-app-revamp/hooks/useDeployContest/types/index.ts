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
  minTokensRequired: string;
  powerType: string;
  powerValue: number;
};

export type SubmissionRequirements = {
  type: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: string;
};
