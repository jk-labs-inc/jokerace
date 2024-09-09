import { createContext, useContext, useRef } from "react";
import { Abi } from "viem";
import { create, createStore, useStore } from "zustand";

export interface RewardModuleInfo {
  abi: Abi;
  contractAddress: string;
  creator: string;
  payees: number[];
  totalShares: number;
  blockExplorers?: string;
}

interface RewardsState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  rewards: RewardModuleInfo;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: string) => void;
  setRewards: (rewards: RewardModuleInfo) => void;
}

export const useRewardsStore = create<RewardsState>(set => ({
  isLoading: false,
  isSuccess: false,
  error: "",
  rewards: {
    abi: [],
    contractAddress: "",
    creator: "",
    payees: [],
    totalShares: 0,
    blockExplorers: "",
  },
  setIsLoading: value => set({ isLoading: value }),
  setError: value => set({ error: value }),
  setIsSuccess: value => set({ isSuccess: value }),
  setRewards: rewards => set({ rewards }),
}));
