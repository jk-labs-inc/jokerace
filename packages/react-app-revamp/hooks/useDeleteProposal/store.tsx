import { create } from "zustand";

interface DeleteProposalState {
  isLoading: boolean;
  error: string;
  isSuccess: boolean;
  transactionData: any;
  pickedProposal: any;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: string) => void;
  setTransactionData: (data: any) => void;
}

export const useDeleteProposalStore = create<DeleteProposalState>(set => ({
  isLoading: false,
  error: "",
  isSuccess: false,
  transactionData: null,
  pickedProposal: null,
  isModalOpen: false,
  setIsModalOpen: isOpen => set({ isModalOpen: isOpen }),
  setIsLoading: value => set({ isLoading: value }),
  setIsSuccess: value => set({ isSuccess: value }),
  setError: value => set({ error: value }),
  setTransactionData: data => set({ transactionData: data }),
}));
