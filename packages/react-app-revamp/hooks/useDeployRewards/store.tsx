import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

type StatusType = "idle" | "success" | "error" | "inProgress";

interface DeployRewardsState {
  ranks: number[];
  shares: number[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  cancel: boolean;
  deployRewardsData: {
    hash: string;
    address: string;
  };
  statusMessage: string;
  statusType: StatusType;
  setStatus: (message: string, type: StatusType) => void;
  setDeployRewardsData: (hash: string, address: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
  setCancel: (cancel: boolean) => void;
  setRanks: (rank: number[]) => void;
  setShares: (share: number[]) => void;
  reset: () => void;
}

export const createDeployRewardsStore = () =>
  createStore<DeployRewardsState>(set => {
    const initialState = {
      ranks: [],
      shares: [],
      isLoading: false,
      isSuccess: false,
      isError: false,
      statusMessage: "",
      statusType: "idle" as StatusType,
      cancel: false,
      deployRewardsData: {
        hash: "",
        address: "",
      },
    };

    return {
      ...initialState,
      setStatus: (message, type) => set({ statusMessage: message, statusType: type }),
      setIsLoading: isLoading => set({ isLoading }),
      setIsSuccess: isSuccess => set({ isSuccess }),
      setIsError: isError => set({ isError }),
      setCancel: cancel => set({ cancel: cancel }),
      setDeployRewardsData: (hash, address) => set(state => ({ deployRewardsData: { hash, address } })),
      setRanks: ranks => set({ ranks }),
      setShares: shares => set({ shares }),
      reset: () => set({ ...initialState }),
    };
  });

export const DeployRewardsContext = createContext<ReturnType<typeof createDeployRewardsStore> | null>(null);

export function DeployRewardsWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createDeployRewardsStore>>();
  if (!storeRef.current) {
    storeRef.current = createDeployRewardsStore();
  }
  return <DeployRewardsContext.Provider value={storeRef.current}>{children}</DeployRewardsContext.Provider>;
}

export function useDeployRewardsStore<T>(selector: (state: DeployRewardsState) => T) {
  const store = useContext(DeployRewardsContext);
  if (store === null) {
    throw new Error("Missing DeployRewards in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
