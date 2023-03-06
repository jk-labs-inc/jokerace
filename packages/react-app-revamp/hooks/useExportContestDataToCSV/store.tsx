import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

interface ExportDataState {
  shouldStart: boolean;
  csv: any;
  isSuccess: boolean;
  isLoading: boolean;
  error: CustomError | null;
  loadingMessage: string | null;
  isReady: boolean;
  cid: any;
  setCid: (cid: any) => void;
  setCsv: (data: any) => void;
  setIsSuccess: (value: boolean) => void;
  setError: (value: CustomError | null) => void;
  setIsLoading: (value: boolean) => void;
  setIsReady: (value: boolean) => void;
  setLoadingMessage: (message: string | null) => void;
  setShouldStart: (value: boolean) => void;
  resetState: () => void;
}

export const createExportDataStore = () =>
  createStore<ExportDataState>(set => ({
    shouldStart: false,
    csv: null,
    isSuccess: false,
    isLoading: false,
    error: null,
    loadingMessage: null,
    isReady: false,
    cid: null,
    setCid: cid => set(() => ({ cid })),
    setCsv: data => set(() => ({ csv: data })),
    setIsSuccess: value => set(() => ({ isSuccess: value })),
    setError: value => set(() => ({ error: value })),
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
        isLoading: false,
        error: null,
        loadingMessage: null,
        isReady: false,
      })),
  }));

export const ExportDataContext = createContext<ReturnType<typeof createExportDataStore> | null>(null);

export function ExportDataWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createExportDataStore>>();
  if (!storeRef.current) {
    storeRef.current = createExportDataStore();
  }
  return <ExportDataContext.Provider value={storeRef.current}>{children}</ExportDataContext.Provider>;
}

export function useExportDataStore<T>(selector: (state: ExportDataState) => T) {
  const store = useContext(ExportDataContext);
  if (store === null) {
    throw new Error("Missing ExportDataWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
