import create from "zustand";

const useStore = create(set => ({
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

export function useContractFactory() {
  const state = useStore();
  return state;
}

export default useContractFactory;
