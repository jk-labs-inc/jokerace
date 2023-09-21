import React, { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

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

export const createSubmitProposalStore = () =>
  createStore<SubmitProposalState>(set => ({
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

export const SubmitProposalContext = createContext<ReturnType<typeof createSubmitProposalStore> | null>(null);

export function SubmitProposalWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createSubmitProposalStore>>();
  if (!storeRef.current) {
    storeRef.current = createSubmitProposalStore();
  }
  return <SubmitProposalContext.Provider value={storeRef.current}>{children}</SubmitProposalContext.Provider>;
}

export function useSubmitProposalStore<T>(selector: (state: SubmitProposalState) => T) {
  const store = useContext(SubmitProposalContext);
  if (store === null) {
    throw new Error("Missing SubmitProposalWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
