import { create } from "zustand";

type ClaimKey = string; // Format: "rank-tokenAddress"
type ClaimState = Record<ClaimKey, boolean>;

type Store = {
  loadingStates: ClaimState;
  successStates: ClaimState;
  setLoading: (payee: number, tokenAddress: string, isLoading: boolean) => void;
  setSuccess: (payee: number, tokenAddress: string, isSuccess: boolean) => void;
  resetStates: () => void;
};

export const useClaimRewardsStore = create<Store>(set => ({
  loadingStates: {} as ClaimState,
  successStates: {} as ClaimState,
  setLoading: (payee: number, tokenAddress: string, isLoading: boolean) =>
    set(state => ({
      loadingStates: { ...state.loadingStates, [`${payee}-${tokenAddress}`]: isLoading },
    })),
  setSuccess: (payee: number, tokenAddress: string, isSuccess: boolean) =>
    set(state => ({
      successStates: { ...state.successStates, [`${payee}-${tokenAddress}`]: isSuccess },
    })),
  resetStates: () => set({ loadingStates: {}, successStates: {} }),
}));
