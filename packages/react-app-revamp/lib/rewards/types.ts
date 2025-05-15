import { Abi } from "viem";

export type ContractQuery = {
  address: `0x${string}`;
  chainId: number;
  abi: Abi;
  functionName: string;
  args: any[];
};

export interface RewardToken {
  tokenAddress: string;
  balance: number;
}

export interface RewardsModuleInfo {
  abi: Abi | null;
  moduleType: ModuleType | null;
}

export enum ModuleType {
  VOTER_REWARDS = "VOTER_REWARDS",
  AUTHOR_REWARDS = "AUTHOR_REWARDS",
}

export const VOTER_REWARDS_VERSION = "5.5";
