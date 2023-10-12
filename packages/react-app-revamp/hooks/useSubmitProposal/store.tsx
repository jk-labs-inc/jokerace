import { create } from "zustand";

interface SubmitProposalState {
  isModalOpen: boolean;
  isMobileConfirmModalOpen: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  proposalId: string;
  transactionData: any;
  setTransactionData: (value: any) => void;
  setProposalId: (value: string) => void;
  setIsModalOpen: (value: boolean) => void;
  setIsMobileConfirmModalOpen: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: string) => void;
}

export const useSubmitProposalStore = create<SubmitProposalState>(set => ({
  isModalOpen: false,
  isMobileConfirmModalOpen: false,
  isLoading: false,
  isSuccess: false,
  error: "",
  proposalId: "",
  transactionData: null,
  setTransactionData: (value: any) => set({ transactionData: value }),
  setProposalId: (value: string) => set({ proposalId: value }),
  setIsModalOpen: (value: boolean) => set({ isModalOpen: value }),
  setIsMobileConfirmModalOpen: (value: boolean) => set({ isMobileConfirmModalOpen: value }),
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  setIsSuccess: (value: boolean) => set({ isSuccess: value }),
  setError: (value: string) => set({ error: value }),
}));
