import { createContext, useContext, useRef } from "react";
import { Abi } from "viem";
import { createStore, useStore } from "zustand";

interface RewardModuleInfo {
  abi: Abi | null;
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

export const createRewardsStore = () =>
  createStore<RewardsState>(set => ({
    isLoading: false,
    isSuccess: false,
    error: "",
    rewards: {
      abi: null,
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

export const RewardsContext = createContext<ReturnType<typeof createRewardsStore> | null>(null);

export function RewardsWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createRewardsStore>>();
  if (!storeRef.current) {
    storeRef.current = createRewardsStore();
  }
  return <RewardsContext.Provider value={storeRef.current}>{children}</RewardsContext.Provider>;
}

export function useRewardsStore<T>(selector: (state: RewardsState) => T) {
  const store = useContext(RewardsContext);
  if (store === null) {
    throw new Error("Missing RewardsWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
