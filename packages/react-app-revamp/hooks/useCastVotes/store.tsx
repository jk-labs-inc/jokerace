import React, { createContext, useContext, useRef } from "react";
import { TransactionError } from "types/error";
import { createStore, useStore } from "zustand";

interface CastVotesState {
  pickedProposal: string | null;
  isModalOpen: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  error: TransactionError | null;
  transactionData: any;
  castPositiveAmountOfVotes: boolean;
  setTransactionData: (value: any) => void;
  setPickedProposal: (value: string | null) => void;
  setIsModalOpen: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setCastPositiveAmountOfVotes: (value: boolean) => void;
  setError: (value: TransactionError | null) => void;
}

export const createCastVotesStore = () =>
  createStore<CastVotesState>(set => ({
    pickedProposal: null,
    isModalOpen: false,
    isLoading: false,
    isSuccess: false,
    error: null,
    transactionData: null,
    castPositiveAmountOfVotes: true,
    setTransactionData: value => set({ transactionData: value }),
    setPickedProposal: value => set({ pickedProposal: value }),
    setIsModalOpen: value => set({ isModalOpen: value }),
    setIsLoading: value => set({ isLoading: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setCastPositiveAmountOfVotes: value => set({ castPositiveAmountOfVotes: value }),
    setError: value => set({ error: value }),
  }));

export const CastVotesContext = createContext<ReturnType<typeof createCastVotesStore> | null>(null);

export function CastVotesWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createCastVotesStore>>();
  if (!storeRef.current) {
    storeRef.current = createCastVotesStore();
  }
  return <CastVotesContext.Provider value={storeRef.current}>{children}</CastVotesContext.Provider>;
}

export function useCastVotesStore<T>(selector: (state: CastVotesState) => T) {
  const store = useContext(CastVotesContext);
  if (store === null) {
    throw new Error("Missing CastVotesWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
