import { create } from "zustand";

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
  validationError: {
    uniqueRanks?: string;
    zeroProportion?: string;
    invalidTotal?: string;
    duplicateRank?: string;
  };
  displayCreatePool: boolean;
  setValidationError: (validationError: {}) => void;
  setDeployRewardsData: (hash: string, address: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setIsError: (isError: boolean) => void;
  setCancel: (cancel: boolean) => void;
  setRanks: (rank: number[]) => void;
  setShares: (share: number[]) => void;
  setDisplayCreatePool: (displayCreatePool: boolean) => void;
  reset: () => void;
}

export const useDeployRewardsStore = create<DeployRewardsState>(set => {
  const initialState = {
    ranks: [],
    shares: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    cancel: false,
    validationError: {
      uniqueRanks: undefined,
      zeroProportion: undefined,
      invalidTotal: undefined,
      duplicateRank: undefined,
    },
    displayCreatePool: true,
    deployRewardsData: {
      hash: "",
      address: "",
    },
  };

  return {
    ...initialState,
    setValidationError: error => set({ validationError: error }),
    setIsLoading: isLoading => set({ isLoading }),
    setIsSuccess: isSuccess => set({ isSuccess }),
    setIsError: isError => set({ isError }),
    setCancel: cancel => set({ cancel: cancel }),
    setDeployRewardsData: (hash, address) => set(state => ({ deployRewardsData: { hash, address } })),
    setRanks: ranks => set({ ranks }),
    setShares: shares => set({ shares }),
    setDisplayCreatePool: displayCreatePool => set({ displayCreatePool }),
    reset: () => set({ ...initialState }),
  };
});
