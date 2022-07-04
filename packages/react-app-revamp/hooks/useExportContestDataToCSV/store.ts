import create from "zustand";

interface ExportDataState {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  loadingMessage: string | null;
  error: null | string;
  csv: any;
  setCsv: (data: any) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (err: string | null, isErr: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingMessage: (message: string | null) => void;
}

export const createExportDataStore = () =>
  create<ExportDataState>(set => ({
    csv: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    error: null,
    loadingMessage: null,
    setCsv: data => set(() => ({ csv: data })),
    setIsSuccess: value => set(() => ({ isSuccess: value })),
    setError: (err, isErr) => set(() => ({ error: err, isError: isErr })),
    setIsLoading: value => set(() => ({ isLoading: value })),
    setLoadingMessage: message => set(() => ({ loadingMessage: message })),
  }));
