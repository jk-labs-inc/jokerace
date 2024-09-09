import { createContext, useContext, useRef } from "react";
import { create, createStore, useStore } from "zustand";

export interface ContractFactoryState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
  data: any;
  setIsSuccess: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setData: (value: any) => void;
  setError: (value: string) => void;
}

export const useContractFactoryStore = create<ContractFactoryState>(set => ({
  isLoading: false,
  isSuccess: false,
  error: "",
  data: null,
  setIsSuccess: value => set({ isSuccess: value }),
  setIsLoading: value => set({ isLoading: value }),
  setData: value => set({ data: value }),
  setError: value => set({ error: value }),
}));
