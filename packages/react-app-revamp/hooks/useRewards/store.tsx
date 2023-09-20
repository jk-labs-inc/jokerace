import { createContext, useContext, useRef } from "react";
import { TransactionError } from "types/error";
import { createStore, useStore } from "zustand";
interface RewardsState {
  isLoading: boolean;
  isSuccess: boolean;
  error: TransactionError | null;
  rewards: any;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: TransactionError | null) => void;
  setRewards: (rewards: any) => void;
}

export const createRewardsStore = () =>
  createStore<RewardsState>(set => ({
    isLoading: false,
    isSuccess: false,
    error: null,
    rewards: {},
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
