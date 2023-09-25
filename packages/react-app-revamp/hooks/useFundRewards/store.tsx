import { create } from "zustand";

export type Reward = {
  address: string;
  amount: string;
};

interface FundRewardsState {
  isLoading: boolean;
  error: string;
  isSuccess: boolean;
  transactionData: any;
  rewards: Reward[];
  isModalOpen: boolean;
  validationError: { tokenAddress?: string; amount?: string }[];
  cancel: boolean;
  setValidationError: (validationError: { tokenAddress?: string; amount?: string }[]) => void;
  setRewards: (reward: Reward[]) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setCancel: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: string) => void;
  setTransactionData: (data: any) => void;
}

export const useFundRewardsStore = create<FundRewardsState>(set => ({
  isLoading: false,
  error: "",
  rewards: [],
  cancel: false,
  isSuccess: false,
  transactionData: null,
  isModalOpen: false,
  validationError: [],
  setValidationError: errors => set({ validationError: errors }),
  setRewards: rewards => set({ rewards: rewards }),
  setIsModalOpen: isOpen => set({ isModalOpen: isOpen }),
  setIsLoading: value => set({ isLoading: value }),
  setIsSuccess: value => set({ isSuccess: value }),
  setCancel: value => set({ cancel: value }),
  setError: value => set({ error: value }),
  setTransactionData: data => set({ transactionData: data }),
}));
