import create from "zustand";
import createContext from "zustand/context";

export const { Provider, useStore } = createContext();

export const createStore = () => {
  return create(set => ({
    contestStatus: null,
    contestName: null,
    contestAuthor: null,
    submissionsOpen: null,
    votesOpen: null,
    votesClose: null,
    votingToken: null,
    votingTokenAddress: null,
    amountOfTokensRequiredToSubmitEntry: 0,
    currentUserAvailableVotesAmount: null,
    currentUserTotalVotesCast: null,
    listProposalsIds: [],
    listProposalsData: {},
    isLoading: true,
    isError: null,
    isSuccess: false,
    isListProposalsError: null,
    isListProposalsSuccess: false,
    isListProposalsLoading: true,
    contestMaxNumberSubmissionsPerUser: null,
    contestMaxProposalCount: null,
    currentUserProposalCount: 0,
    setCurrentUserProposalCount: (amount: number) => set({ currentUserProposalCount: amount }),
    //@ts-ignore
    increaseCurrentUserProposalCount: () =>
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
    //@ts-ignore
    addProposalId: (id: number | string) => set(state => ({ listProposalsIds: [...state.listProposalsIds, id] })),
    setContestMaxProposalCount: (amount: number | null) => set({ contestMaxProposalCount: amount }),
    setContestMaxNumberSubmissionsPerUser: (amount: number | null) =>
      set({ contestMaxNumberSubmissionsPerUser: amount }),
    setContestStatus: (status: number) => set({ contestStatus: status }),
    setContestName: (name: string) => set({ contestName: name }),
    setContestAuthor: (author: string) => set({ contestAuthor: author }),
    setSubmissionsOpen: (datetime: string) => set({ submissionsOpen: datetime }),
    setVotesOpen: (datetime: string) => set({ votesOpen: datetime }),
    setVotesClose: (datetime: string) => set({ votesClose: datetime }),
    setVotingToken: (token: any) => set({ votingToken: token }),
    setVotingTokenAddress: (address: any) => set({ votingTokenAddress: address }),
    setCurrentUserAvailableVotesAmount: (amount: number) => set({ currentUserAvailableVotesAmount: amount }),
    setCurrentUserTotalVotesCast: (amount: number) => set({ currentUserTotalVotesCast: amount }),
    setAmountOfTokensRequiredToSubmitEntry: (amount: number) => set({ amountOfTokensRequiredToSubmitEntry: amount }),
    setListProposalsIds: (list: any) => set({ listProposalsIds: list }),
    setIsListProposalsLoading: (value: boolean) => set({ isListProposalsLoading: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsListProposalsError: (value: string | null) => set({ isListProposalsError: value }),
    setIsError: (value: string | null) => set({ isError: value }),
    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
    setIsListProposalsSuccess: (value: boolean) => set({ isListProposalsSuccess: value }),
    resetListProposals: () => set({ listProposalsData: {}, listProposalsIds: [] }),
    //@ts-ignore
    increaseProposalVotes: ({ id, votes }) =>
      set(state => ({
        ...state,
        listProposalsData: {
          //@ts-ignore
          ...state.listProposalsData,
          [id]: {
            //@ts-ignore
            ...state.listProposalsData[id],
            //@ts-ignore
            votes: state.listProposalsData[id]?.votes += votes,
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
  }));
};

export const stateContest = {
  [0]: "Active (voting is open)",
  [1]: "Cancelled",
  [2]: "Queued (proposal submissions are open)",
  [3]: "Completed",
};
