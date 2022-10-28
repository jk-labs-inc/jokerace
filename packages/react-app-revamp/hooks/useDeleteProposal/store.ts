import create from "zustand";
import createContext from "zustand/context";

export const createStore = () => {
  return create(set => ({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
    transactionData: null,
    pickedProposal: null,
    isModalOpen: false,
    setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
    setPickedProposal: (id: any) => set({ pickedProposal: id }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
    setIsError: (isError: boolean, error: string | null) => set({ isError: isError, error }),
    setTransactionData: (data: any) => set({ transactionData: data }),
  }));
};

export const { Provider, useStore } = createContext();
