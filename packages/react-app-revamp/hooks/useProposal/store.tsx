import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

interface ProposalState {
  listProposalsIds: string[];
  listProposalsData: any;
  isListProposalsLoading: boolean;
  isListProposalsSuccess: boolean;
  isListProposalsError: CustomError | null;
  isPageProposalsLoading: boolean;
  isPageProposalsError: CustomError | null;
  isPageProposalSuccess: boolean;
  indexPaginationProposals: Array<any[]>;
  totalPagesPaginationProposals: number;
  currentPagePaginationProposals: number;
  hasPaginationProposalsNextPage: boolean;
  canUpdateVotesInRealTime: boolean;

  addProposalId: (id: string) => void;
  setListProposalsIds: (list: string[]) => void;
  setIsListProposalsLoading: (value: boolean) => void;
  setIsListProposalsSuccess: (value: boolean) => void;
  setIsListProposalsError: (value: CustomError | null) => void;
  setProposalData: (proposal: any) => void;
  setProposalVotes: (id: any, votes: any) => void;
  softDeleteProposals: (ids: string[]) => void;
  resetListProposals: () => void;
  setIsPageProposalsLoading: (value: boolean) => void;
  setIsPageProposalsError: (value: CustomError | null) => void;
  setIsPageProposalsSuccess: (value: boolean) => void;
  setIndexPaginationProposalPerId: (proposals: any[]) => void;
  setTotalPagesPaginationProposals: (value: number) => void;
  setCurrentPagePaginationProposals: (value: number) => void;
  setHasPaginationProposalsNextPage: (value: boolean) => void;
  setCanUpdateVotesInRealTime: (value: boolean) => void;
}

export const createProposalStore = () =>
  createStore<ProposalState>(set => ({
    listProposalsIds: [],
    listProposalsData: {},
    isListProposalsLoading: false,
    isListProposalsSuccess: false,
    isListProposalsError: null,
    isPageProposalsLoading: false,
    isPageProposalsError: null,
    isPageProposalSuccess: false,
    indexPaginationProposals: [],
    totalPagesPaginationProposals: 0,
    currentPagePaginationProposals: 0,
    hasPaginationProposalsNextPage: false,
    canUpdateVotesInRealTime: false,

    setIsPageProposalsLoading: value => set({ isPageProposalsLoading: value }),
    setIsPageProposalsSuccess: value => set({ isPageProposalSuccess: value }),
    setIsPageProposalsError: value => set({ isPageProposalsError: value }),
    setCurrentPagePaginationProposals: currentPage =>
      set({
        currentPagePaginationProposals: currentPage,
      }),
    setIndexPaginationProposalPerId: proposalsPages =>
      set({
        indexPaginationProposals: proposalsPages,
      }),
    setTotalPagesPaginationProposals: newTotal => set({ totalPagesPaginationProposals: newTotal }),
    setHasPaginationProposalsNextPage: hasNextPage => set({ hasPaginationProposalsNextPage: hasNextPage }),
    addProposalId: id => set(state => ({ listProposalsIds: [...state.listProposalsIds, id] })),
    setProposalVotes: ({ id, votes }) =>
      set(state => ({
        ...state,
        listProposalsData: {
          ...state.listProposalsData,
          [id]: {
            ...state.listProposalsData[id],
            votes: votes,
          },
        },
      })),
    setProposalData: ({ id, data }) =>
      set(state => ({
        ...state,
        listProposalsData: {
          ...state.listProposalsData,
          [id]: {
            ...state.listProposalsData[id],
            ...data,
          },
        },
      })),
    softDeleteProposals: (idsToDelete: string[]) =>
      set(state => {
        const updatedListProposalsData = { ...state.listProposalsData };
        const idsToDeleteSet = new Set(idsToDelete.map(id => id.toString()));

        const updatedListProposalsIds = state.listProposalsIds
          .map(existingId => existingId.toString())
          .filter(existingIdStr => !idsToDeleteSet.has(existingIdStr));

        idsToDelete.forEach(id => {
          delete updatedListProposalsData[id];
        });

        return {
          ...state,
          listProposalsData: updatedListProposalsData,
          listProposalsIds: updatedListProposalsIds,
        };
      }),

    resetListProposals: () => set({ listProposalsData: {}, listProposalsIds: [] }),
    setCanUpdateVotesInRealTime: value => set({ canUpdateVotesInRealTime: value }),
    setIsListProposalsLoading: value => set({ isListProposalsLoading: value }),
    setIsListProposalsError: value => set({ isListProposalsError: value }),
    setIsListProposalsSuccess: value => set({ isListProposalsSuccess: value }),
    setListProposalsIds: list => set({ listProposalsIds: list }),
  }));

export const ProposalContext = createContext<ReturnType<typeof createProposalStore> | null>(null);

export function ProposalWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createProposalStore>>();
  if (!storeRef.current) {
    storeRef.current = createProposalStore();
  }
  return <ProposalContext.Provider value={storeRef.current}>{children}</ProposalContext.Provider>;
}

export function useProposalStore<T>(selector: (state: ProposalState) => T) {
  const store = useContext(ProposalContext);
  if (store === null) {
    throw new Error("Missing ProposalWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
