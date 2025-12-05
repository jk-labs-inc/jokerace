import type { Abi } from "viem";

export interface SubmissionLoaderData {
  address: string;
  chain: string;
  submission: string;
  chainId: number;
  abi: Abi;
  version: string;
  contestName: string;
}

export interface SubmissionMetadata {
  title: string;
  description: string;
}
