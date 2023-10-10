import { create } from "zustand";

interface SubmitProposalState {
  isModalOpen: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  transactionData: any;
  setTransactionData: (value: any) => void;
  setIsModalOpen: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: string) => void;
}

export const useSubmitProposalStore = create<SubmitProposalState>(set => ({
  isModalOpen: false,
  isLoading: false,
  isSuccess: false,
  error: "",
  transactionData: null,
  setTransactionData: (value: any) => set({ transactionData: value }),
  setIsModalOpen: (value: boolean) => set({ isModalOpen: value }),
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  setIsSuccess: (value: boolean) => set({ isSuccess: value }),
  setError: (value: string) => set({ error: value }),
}));
