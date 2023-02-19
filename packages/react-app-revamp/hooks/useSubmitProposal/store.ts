import { CustomError } from "types/error";
import create from "zustand";
import createContext from "zustand/context";

export const createStore = () => {
  return create(set => ({
    isModalOpen: false,
    isLoading: false,
    isSuccess: false,
    error: null,
    transactionData: null,
    setTransactionData: (value: any) => set({ transactionData: value }),
    setIsModalOpen: (value: boolean) => set({ isModalOpen: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
    setError: (value: CustomError | null) => set({ error: value }),
  }));
};

export const { Provider, useStore } = createContext();
