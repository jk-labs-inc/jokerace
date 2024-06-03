import { create } from "zustand";

interface SelectedTokenBalanceState {
  selectedTokenBalance: string;
  setSelectedTokenBalance: (balance: string) => void;
  resetSelectedTokenBalance: () => void;
}

export const useSelectedTokenBalanceStore = create<SelectedTokenBalanceState>(set => ({
  selectedTokenBalance: "0",
  setSelectedTokenBalance: (balance: string) => set({ selectedTokenBalance: balance }),
  resetSelectedTokenBalance: () => set({ selectedTokenBalance: "0" }),
}));
