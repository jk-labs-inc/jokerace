import create from "zustand";
import createContext from "zustand/context";

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
