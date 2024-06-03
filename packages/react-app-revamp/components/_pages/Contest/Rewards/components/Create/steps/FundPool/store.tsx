import { FilteredToken } from "@hooks/useTokenList";
import { create } from "zustand";

export interface FundPoolToken extends FilteredToken {
  amount: string;
  decimals: number;
}

interface FundPoolState {
  tokens: FundPoolToken[];
  setTokens: (tokens: FundPoolToken[]) => void;
}

export const useFundPoolStore = create<FundPoolState>(set => ({
  tokens: [],
  setTokens: (tokens: FundPoolToken[]) => set({ tokens }),
}));
