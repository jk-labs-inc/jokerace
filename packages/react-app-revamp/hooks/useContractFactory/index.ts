import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

export interface StoreFactoryState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
  data: any;
  setIsSuccess: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setData: (value: any) => void;
  setIsError: (value: boolean) => void;
  setErrorMessage: (value: any) => void;
}

export const createStoreFactoryStore = () =>
  createStore<StoreFactoryState>(set => ({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: null,

    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setData: (value: any) => set({ data: value }),
    setIsError: (value: boolean) => set({ isError: value }),
    setErrorMessage: (value: string | null) => set({ error: value }),
  }));

export const StoreFactoryContext = createContext<ReturnType<typeof createStoreFactoryStore> | null>(null);

export function useStoreFactoryStore<T>(selector: (state: StoreFactoryState) => T) {
  const store = useContext(StoreFactoryContext);
  if (store === null) {
    throw new Error("Missing Wrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
