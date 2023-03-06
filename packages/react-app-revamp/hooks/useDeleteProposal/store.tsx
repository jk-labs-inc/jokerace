import React, { createContext, useRef, useContext } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

interface DeleteProposalState {
  isLoading: boolean;
  error: CustomError | null;
  isSuccess: boolean;
  transactionData: any;
  pickedProposal: any;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setPickedProposal: (id: any) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: CustomError | null) => void;
  setTransactionData: (data: any) => void;
}

export const createDeleteProposalStore = () =>
  createStore<DeleteProposalState>(set => ({
    isLoading: false,
    error: null,
    isSuccess: false,
    transactionData: null,
    pickedProposal: null,
    isModalOpen: false,
    setIsModalOpen: isOpen => set({ isModalOpen: isOpen }),
    setPickedProposal: id => set({ pickedProposal: id }),
    setIsLoading: value => set({ isLoading: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setError: value => set({ error: value }),
    setTransactionData: data => set({ transactionData: data }),
  }));

export const DeleteProposalContext = createContext<ReturnType<typeof createDeleteProposalStore> | null>(null);

export function DeleteProposalWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createDeleteProposalStore>>();
  if (!storeRef.current) {
    storeRef.current = createDeleteProposalStore();
  }
  return <DeleteProposalContext.Provider value={storeRef.current}>{children}</DeleteProposalContext.Provider>;
}

export function useDeleteProposalStore<T>(selector: (state: DeleteProposalState) => T) {
  const store = useContext(DeleteProposalContext);
  if (store === null) {
    throw new Error("Missing DeleteProposalWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
