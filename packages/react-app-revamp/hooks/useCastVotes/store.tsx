import React, { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface CastVotesState {
  pickedProposal: string | null;
  isModalOpen: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  transactionData: any;
  castPositiveAmountOfVotes: boolean;
  setTransactionData: (value: any) => void;
  setPickedProposal: (value: string | null) => void;
  setIsModalOpen: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  setCastPositiveAmountOfVotes: (value: boolean) => void;
  setError: (value: string) => void;
  resetStore: () => void;
}

const initialState = {
  pickedProposal: null,
  isModalOpen: false,
  isLoading: false,
  isSuccess: false,
  error: "",
  transactionData: null,
  castPositiveAmountOfVotes: true,
};

export const createCastVotesStore = () =>
  createStore<CastVotesState>(set => ({
    ...initialState, // Spread initial state
    setTransactionData: value => set({ transactionData: value }),
    setPickedProposal: value => set({ pickedProposal: value }),
    setIsModalOpen: value => set({ isModalOpen: value }),
    setIsLoading: value => set({ isLoading: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setCastPositiveAmountOfVotes: value => set({ castPositiveAmountOfVotes: value }),
    setError: value => set({ error: value }),
    resetStore: () => set(initialState),
  }));

export const CastVotesContext = createContext<ReturnType<typeof createCastVotesStore> | null>(null);

export function CastVotesWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createCastVotesStore>>(createCastVotesStore());
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
