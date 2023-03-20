import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

interface ProposalVotesState {
  isListVotersSuccess: boolean;
  isListVotersError: string | null;
  isListVotersLoading: boolean;
  votesPerAddress: Record<string, any>;
  isPageVotesLoading: boolean;
  isPageVotesSuccess: boolean;
  isPageVotesError: CustomError | null;
  indexPaginationVotes: Array<any>;
  totalPagesPaginationVotes: number;
  currentPagePaginationVotes: number;
  hasPaginationVotesNextPage: boolean;
  setIsPageVotesLoading: (value: boolean) => void;
  setIsPageVotesSuccess: (value: boolean) => void;
  setIsPageVotesError: (value: CustomError | null) => void;
  setCurrentPagePaginationVotes: (currentPage: number) => void;
  setIndexPaginationVotesPerId: (votesPages: Array<any>) => void;
  setTotalPagesPaginationVotes: (newTotal: number) => void;
  setHasPaginationVotesNextPage: (hasNextPage: boolean) => void;
  setVotesPerAddress: ({ address, value }: { address: string; value: any }) => void;
  setIsListVotersLoading: (value: boolean) => void;
  setIsListVotersSuccess: (value: boolean) => void;
  setIsListVotersError: (value: string | null) => void;
}

export const createProposalVotesStore = () =>
  createStore<ProposalVotesState>(set => ({
    isListVotersSuccess: false,
    isListVotersError: null,
    isListVotersLoading: true,
    votesPerAddress: {},
    isPageVotesLoading: false,
    isPageVotesSuccess: false,
    isPageVotesError: null,
    indexPaginationVotes: [],
    totalPagesPaginationVotes: 0,
    currentPagePaginationVotes: 0,
    hasPaginationVotesNextPage: false,
    setIsPageVotesLoading: value => set({ isPageVotesLoading: value }),
    setIsPageVotesSuccess: value => set({ isPageVotesSuccess: value }),
    setIsPageVotesError: value => set({ isPageVotesError: value }),
    setCurrentPagePaginationVotes: currentPage =>
      set({
        currentPagePaginationVotes: currentPage,
      }),
    setIndexPaginationVotesPerId: votesPages =>
      set({
        indexPaginationVotes: votesPages,
      }),
    setTotalPagesPaginationVotes: newTotal => set({ totalPagesPaginationVotes: newTotal }),
    setHasPaginationVotesNextPage: hasNextPage => set({ hasPaginationVotesNextPage: hasNextPage }),
    setVotesPerAddress: ({ address, value }) =>
      set(state => ({
        ...state,
        votesPerAddress: {
          ...state.votesPerAddress,
          [address]: value,
        },
      })),
    setIsListVotersLoading: value => set({ isListVotersLoading: value }),
    setIsListVotersSuccess: value => set({ isListVotersSuccess: value }),
    setIsListVotersError: value => set({ isListVotersError: value }),
  }));

export const ProposalVotesContext = createContext<ReturnType<typeof createProposalVotesStore> | null>(null);

export function ProposalVotesWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createProposalVotesStore>>();
  if (!storeRef.current) {
    storeRef.current = createProposalVotesStore();
  }
  return <ProposalVotesContext.Provider value={storeRef.current}>{children}</ProposalVotesContext.Provider>;
}

export function useProposalVotesStore<T>(selector: (state: ProposalVotesState) => T) {
  const store = useContext(ProposalVotesContext);
  if (store === null) {
    throw new Error("Missing ProposalVotesWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
