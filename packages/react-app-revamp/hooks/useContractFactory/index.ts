import create from "zustand";

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

const useStore = create<StoreFactoryState>(set => ({
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

export function useContractFactory(): StoreFactoryState {
  const state = useStore();
  return state;
}

export default useContractFactory;
