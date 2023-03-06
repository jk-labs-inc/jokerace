import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
interface RewardsState {
  isLoading: boolean;
  isError: any;
  isSuccess: boolean;
  rewards: any;
  setIsLoading: (isLoading: boolean) => void;
  setIsError: (value: string | null) => void;
  setIsSuccess: (value: boolean) => void;
  setRewards: (rewards: any) => void;
}

export const createRewardsStore = () =>
  createStore<RewardsState>(set => ({
    isLoading: true,
    isError: null,
    isSuccess: false,
    rewards: {},
    setIsLoading: value => set({ isLoading: value }),
    setIsError: value => set({ isError: value }),
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
