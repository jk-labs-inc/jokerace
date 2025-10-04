export interface LoadingSliceState {
  isLoading: boolean;
  isError: boolean;
}

export interface LoadingSliceActions {
  setIsLoading: (loading: boolean) => void;
  setIsError: (error: boolean) => void;
}

export type LoadingSlice = LoadingSliceState & LoadingSliceActions;

export const createLoadingSlice = (set: any): LoadingSlice => ({
  isLoading: false,
  isError: false,

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setIsError: (error: boolean) => set({ isError: error }),
});
