import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

export interface ContractFactoryState {
  isLoading: boolean;
  isSuccess: boolean;
  error: CustomError | null;
  data: any;
  setIsSuccess: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setData: (value: any) => void;
  setError: (value: CustomError | null) => void;
}

export const createContractFactoryStore = () =>
  createStore<ContractFactoryState>(set => ({
    isLoading: false,
    isSuccess: false,
    error: null,
    data: null,
    setIsSuccess: value => set({ isSuccess: value }),
    setIsLoading: value => set({ isLoading: value }),
    setData: value => set({ data: value }),
    setError: value => set({ error: value }),
  }));

export const ContractFactoryContext = createContext<ReturnType<typeof createContractFactoryStore> | null>(null);

export function ContractFactoryWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createContractFactoryStore>>();
  if (!storeRef.current) {
    storeRef.current = createContractFactoryStore();
  }
  return <ContractFactoryContext.Provider value={storeRef.current}>{children}</ContractFactoryContext.Provider>;
}

export function useContractFactoryStore<T>(selector: (state: ContractFactoryState) => T) {
  const store = useContext(ContractFactoryContext);
  if (store === null) {
    throw new Error("Missing ContractFactoryWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
