import create from "zustand";
import createContext from "zustand/context";

export const createStore = () => {
  return create(set => ({
    pickedProposal: null,
    isModalOpen: false,
    isLoading: false,
    isSuccess: false,
    error: null,
    transactionData: null,
    castPositiveAmountOfVotes: true,
    setTransactionData: (value: any) => set({ transactionData: value }),
    setPickedProposal: (value: null | string) => set({ pickedProposal: value }),
    setIsModalOpen: (value: boolean) => set({ isModalOpen: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
    setCastPositiveAmountOfVotes: (value: boolean) => set({ castPositiveAmountOfVotes: value }),
    setError: (value: null | string) => set({ error: value }),
  }));
};

export const { Provider, useStore } = createContext();
