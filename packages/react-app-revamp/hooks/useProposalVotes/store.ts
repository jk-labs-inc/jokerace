import create from "zustand";
import createContext from "zustand/context";

interface ProposalVotesState {
  isListVotersSuccess: boolean;
  isListVotersError: string | null;
  isListVotersLoading: boolean;
  votesPerAddress: Record<string, any>;
  isPageVotesLoading: boolean;
  isPageVotesSuccess: boolean;
  isPageVotesError: string | null;
  indexPaginationVotes: Array<any>;
  totalPagesPaginationVotes: number;
  currentPagePaginationVotes: number;
  hasPaginationVotesNextPage: boolean;
  setIsPageVotesLoading: (value: boolean) => void;
  setIsPageVotesSuccess: (value: boolean) => void;
  setIsPageVotesError: (value: boolean) => void;
  setCurrentPagePaginationVotes: (currentPage: number) => void;
  setIndexPaginationVotesPerId: (votesPages: Array<any>) => void;
  setTotalPagesPaginationVotes: (newTotal: number) => void;
  setHasPaginationVotesNextPage: (hasNextPage: boolean) => void;
  setVotesPerAddress: ({ address, value }: { address: string; value: any }) => void;
  setIsListVotersLoading: (value: boolean) => void;
  setIsListVotersSuccess: (value: boolean) => void;
  setIsListVotersError: (value: string | null) => void;
}

export const createStore = () => {
  return create(set => ({
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
    setIsPageVotesLoading: (value: boolean) => set({ isPageVotesLoading: value }),
    setIsPageVotesSuccess: (value: boolean) => set({ isPageVotesSuccess: value }),
    setIsPageVotesError: (value: boolean) => set({ isPageVotesError: value }),
    setCurrentPagePaginationVotes: (currentPage: number) =>
      set({
        currentPagePaginationVotes: currentPage,
      }),
    setIndexPaginationVotesPerId: (votesPages: Array<any>) =>
      set({
        indexPaginationVotes: votesPages,
      }),
    setTotalPagesPaginationVotes: (newTotal: number) => set({ totalPagesPaginationVotes: newTotal }),
    setHasPaginationVotesNextPage: (hasNextPage: boolean) => set({ hasPaginationVotesNextPage: hasNextPage }),
    //@ts-ignore
    setVotesPerAddress: ({ address, value }) =>
      set(state => ({
        ...state,
        votesPerAddress: {
          //@ts-ignore
          ...state.votesPerAddress,
          [address]: value,
        },
      })),
    setIsListVotersLoading: (value: boolean) => set({ isListVotersLoading: value }),
    setIsListVotersSuccess: (value: boolean) => set({ isListVotersSuccess: value }),
    setIsListVotersError: (value: string | null) => set({ isListVotersError: value }),
  }));
};

export const { Provider, useStore } = createContext();
