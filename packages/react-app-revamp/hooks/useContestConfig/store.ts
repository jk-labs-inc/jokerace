import { create } from "zustand";
import { createEntrySlice, EntrySlice } from "./slices/entrySlice";
import { Abi } from "viem";

export interface ContestConfig {
  address: `0x${string}`;
  abi: Abi;
  chainName: string;
  chainId: number;
  chainNativeCurrencySymbol: string;
  version: string;
}

export interface ContestConfigSliceState {
  contestConfig: ContestConfig;
}

export interface ContestConfigSliceActions {
  setContestConfig: (contestConfig: ContestConfig) => void;
}

export type ContestConfigSlice = ContestConfigSliceState & ContestConfigSliceActions;

export type ContestConfigStore = ContestConfigSlice &
  EntrySlice & {
    resetStore: () => void;
  };

const useContestConfigStore = create<ContestConfigStore>((set, get) => {
  const getInitialState = () => ({
    contestConfig: {
      address: "" as `0x${string}`,
      chainName: "",
      abi: [],
      chainId: 0,
      version: "",
      chainNativeCurrencySymbol: "",
    },
    setContestConfig: (contestConfig: ContestConfig) => set({ contestConfig }),
    ...createEntrySlice(set),
  });

  const initialState = getInitialState();

  return {
    ...initialState,
    resetStore: () => {
      const freshState = getInitialState();
      set(freshState);
    },
  };
});

export default useContestConfigStore;
