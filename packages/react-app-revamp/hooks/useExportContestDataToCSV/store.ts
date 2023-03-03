import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";

interface ExportDataState {
  shouldStart: boolean;
  isReady: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  loadingMessage: string | null;
  error: string | null;
  csv: any;
  cid: string | null;
  setCid: (cid: string) => void;
  setCsv: (data: any) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (err: string | null, isErr: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string | null) => void;
  setIsReady: (isReady: boolean) => void;
  setShouldStart: (shouldStart: boolean) => void;
  resetState: () => void;
}

export const createExportDataStore = () =>
  createStore<ExportDataState>(set => ({
    shouldStart: false,
    csv: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    error: null,
    loadingMessage: null,
    isReady: false,
    cid: null,
    setCid: cid => set(() => ({ cid })),
    setCsv: data => set(() => ({ csv: data })),
    setIsSuccess: value => set(() => ({ isSuccess: value })),
    setError: (err, isErr) => set(() => ({ error: err, isError: isErr })),
    setIsLoading: value => set(() => ({ isLoading: value })),
    setIsReady: value => set(() => ({ isReady: value })),
    setLoadingMessage: message => set(() => ({ loadingMessage: message })),
    setShouldStart: value => set(() => ({ shouldStart: value })),
    resetState: () =>
      set(() => ({
        shouldStart: false,
        csv: null,
        cid: null,
        isSuccess: false,
        isError: false,
        isLoading: false,
        error: null,
        loadingMessage: null,
        isReady: false,
      })),
  }));

export const ExportDataContext = createContext<ReturnType<typeof createExportDataStore> | null>(null);

export function useExportDataStore<T>(selector: (state: ExportDataState) => T) {
  const store = useContext(ExportDataContext);
  if (store === null) {
    throw new Error("Missing Wrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
