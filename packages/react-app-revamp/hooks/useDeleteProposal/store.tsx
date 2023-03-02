import React, { createContext, useRef, useContext } from "react";
import { createStore, useStore } from "zustand";

interface DeleteProposalState {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isSuccess: boolean;
  transactionData: any;
  pickedProposal: any;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setPickedProposal: (id: any) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setIsError: (isError: boolean, error: string | null) => void;
  setTransactionData: (data: any) => void;
}

export const createDeleteProposalStore = () =>
  createStore<DeleteProposalState>(set => ({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
    transactionData: null,
    pickedProposal: null,
    isModalOpen: false,
    setIsModalOpen: isOpen => set({ isModalOpen: isOpen }),
    setPickedProposal: id => set({ pickedProposal: id }),
    setIsLoading: value => set({ isLoading: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setIsError: (isError, error) => set({ isError: isError, error }),
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
    throw new Error("Missing Wrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
