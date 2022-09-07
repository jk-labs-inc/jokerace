import create from "zustand";
import createContext from "zustand/context";

export const { Provider, useStore } = createContext();

export const createStore = () => {
  return create(set => ({
    contestName: null,
    contestPrompt: null,
    contestAuthorEthereumAddress: null,
    contestAuthor: null,
    submissionsOpen: null,
    votesOpen: null,
    votesClose: null,
    votingToken: null,
    votingTokenAddress: null,
    submitProposalToken: null,
    submitProposalTokenAddress: null,
    amountOfTokensRequiredToSubmitEntry: 0,
    currentUserAvailableVotesAmount: null,
    currentUserTotalVotesCast: null,
    listProposalsIds: [],
    listProposalsData: {},
    indexPaginationProposals: [],
    totalPagesPaginationProposals: 0,
    currentPagePaginationProposals: 0,
    hasPaginationProposalsNextPage: false,
    isLoading: true,
    isError: null,
    isSuccess: false,
    isListProposalsError: null,
    isListProposalsSuccess: false,
    isListProposalsLoading: true,
    isPageProposalsLoading: false,
    isPageProposalsError: null,
    isPageProposalSuccess: false,
    contestMaxNumberSubmissionsPerUser: null,
    contestMaxProposalCount: null,
    usersQualifyToVoteIfTheyHoldTokenAtTime: null,
    didUserPassSnapshotAndCanVote: false,
    checkIfUserPassedSnapshotLoading: true,
    snapshotTaken: false,
    currentUserProposalCount: 0,
    downvotingAllowed: false,
    setIsPageProposalsLoading: (value: boolean) => set({ isPageProposalsLoading: value }),
    setIsPageProposalsSuccess: (value: boolean) => set({ isPageProposalsSuccess: value }),
    setIsPageProposalsError: (value: boolean) => set({ isPageProposalsError: value }),

    setCurrentPagePaginationProposals: (currentPage: number) => set({
      currentPagePaginationProposals: currentPage
    }),
    setIndexPaginationProposalPerId: (proposalsPages: Array<any>) => set({
      indexPaginationProposals: proposalsPages,
    }),
    setTotalPagesPaginationProposals: (newTotal: number) => set({ totalPagesPaginationProposals: newTotal }),
    setHasPaginationProposalsNextPage: (hasNextPage: boolean) => set({ hasPaginationProposalsNextPage: hasNextPage }),
    currentUserSubmitProposalTokensAmount: null,
    setIsPageProposalsLoading: (value: boolean) => set({ isPageProposalsLoading: value }),
    setIsPageProposalsSuccess: (value: boolean) => set({ isPageProposalsSuccess: value }),
    setIsPageProposalsError: (value: boolean) => set({ isPageProposalsError: value }),

    setCurrentPagePaginationProposals: (currentPage: number) => set({
      currentPagePaginationProposals: currentPage
    }),
    setIndexPaginationProposalPerId: (proposalsPages: Array<any>) => set({
      indexPaginationProposals: proposalsPages,
    }),
    setTotalPagesPaginationProposals: (newTotal: number) => set({ totalPagesPaginationProposals: newTotal }),
    setHasPaginationProposalsNextPage: (hasNextPage: boolean) => set({ hasPaginationProposalsNextPage: hasNextPage }),
    setDownvotingAllowed: (isAllowed: boolean) => set({ downvotingAllowed: isAllowed }),
    setContestPrompt: (prompt: string | null) => set({ contestPrompt: prompt }),
    setCurrentUserProposalCount: (amount: number) => set({ currentUserProposalCount: amount }),
    increaseCurrentUserProposalCount: () =>
      //@ts-ignore
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
    //@ts-ignore
    addProposalId: (id: number | string) => set(state => ({ listProposalsIds: [...state.listProposalsIds, id] })),
    setContestMaxProposalCount: (amount: number | null) => set({ contestMaxProposalCount: amount }),
    setContestMaxNumberSubmissionsPerUser: (amount: number | null) =>
      set({ contestMaxNumberSubmissionsPerUser: amount }),
    setCurrentUserSubmitProposalTokensAmount: (amount: number | null) =>
      set({ currentUserSubmitProposalTokensAmount: amount }),
    setContestStatus: (status: number) => set({ contestStatus: status }),
    setContestName: (name: string) => set({ contestName: name }),
    setContestAuthor: (author: string, address: string) =>
      set({ contestAuthor: author, contestAuthorEthereumAddress: address }),
    setSubmissionsOpen: (datetime: string) => set({ submissionsOpen: datetime }),
    setDidUserPassSnapshotAndCanVote: (isQualified: boolean) => set({ didUserPassSnapshotAndCanVote: isQualified }),
    setVotesOpen: (datetime: string) => set({ votesOpen: datetime }),
    setVotesClose: (datetime: string) => set({ votesClose: datetime }),
    setVotingToken: (token: any) => set({ votingToken: token }),
    setVotingTokenAddress: (address: any) => set({ votingTokenAddress: address }),
    setSubmitProposalToken: (token: any) => set({ submitProposalToken: token }),
    setSubmitProposalTokenAddress: (address: any) => set({ submitProposalTokenAddress: address }),
    setCurrentUserAvailableVotesAmount: (amount: number) => set({ currentUserAvailableVotesAmount: amount }),
    setCurrentUserTotalVotesCast: (amount: number) => set({ currentUserTotalVotesCast: amount }),
    setUsersQualifyToVoteIfTheyHoldTokenAtTime: (datetime: string) =>
      set({ usersQualifyToVoteIfTheyHoldTokenAtTime: datetime }),
    setAmountOfTokensRequiredToSubmitEntry: (amount: number) => set({ amountOfTokensRequiredToSubmitEntry: amount }),
    setListProposalsIds: (list: any) => set({ listProposalsIds: list }),
    setIsListProposalsLoading: (value: boolean) => set({ isListProposalsLoading: value }),
    setSnapshotTaken: (value: boolean) => set({ snapshotTaken: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setCheckIfUserPassedSnapshotLoading: (value: boolean) => set({ checkIfUserPassedSnapshotLoading: value }),
    setIsListProposalsError: (value: string | null) => set({ isListProposalsError: value }),
    setIsError: (value: string | null) => set({ isError: value }),
    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
    setIsListProposalsSuccess: (value: boolean) => set({ isListProposalsSuccess: value }),
    resetListProposals: () => set({ listProposalsData: {}, listProposalsIds: [] }),
    //@ts-ignore
    setProposalVotes: ({ id, votes }) =>
      set(state => ({
        ...state,
        listProposalsData: {
          //@ts-ignore
          ...state.listProposalsData,
          [id]: {
            //@ts-ignore
            ...state.listProposalsData[id],
            //@ts-ignore
            votes: votes,
          },
        },
      })),
    //@ts-ignore
    setProposalData: ({ id, data }) =>
      set(state => ({
        ...state,
        listProposalsData: {
          //@ts-ignore
          ...state.listProposalsData,
          [id]: {
            //@ts-ignore
            ...state.listProposalsData[id],
            ...data,
          },
        },
      })),
    //@ts-ignore
    softDeleteProposal: id =>
      set(state => ({
        ...state,
        listProposalsData: {
          //@ts-ignore
          ...state.listProposalsData,
          [id]: {
            //@ts-ignore
            ...state.listProposalsData[id],
            content: "This proposal has been deleted by the creator of the contest.",
            isContentImage: false,
          },
        },
      })),
  }));
};
