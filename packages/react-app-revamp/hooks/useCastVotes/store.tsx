import React, { createContext, useContext, useRef } from "react";
import { create, createStore, useStore } from "zustand";

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
}

export const useCastVotesStore = create<CastVotesState>(set => ({
  pickedProposal: null,
  isModalOpen: false,
  isLoading: false,
  isSuccess: false,
  error: "",
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
