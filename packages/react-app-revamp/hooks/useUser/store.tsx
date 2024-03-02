import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface UserState {
  currentUserQualifiedToSubmit: boolean;
  currentUserQualifiedToVote: boolean;
  currentUserTotalVotesAmount: number;
  currentUserAvailableVotesAmount: number;
  contestMaxNumberSubmissionsPerUser: number;
  currentUserProposalCount: number;
  currentUserTotalVotesCast: number;
  currentUserVotesOnProposal: number;
  isCurrentUserSubmitQualificationLoading: boolean;
  isCurrentUserSubmitQualificationSuccess: boolean;
  isCurrentUserSubmitQualificationError: boolean;
  isCurrentUserVoteQualificationLoading: boolean;
  isCurrentUserVoteQualificationSuccess: boolean;
  isCurrentUserVoteQualificationError: boolean;
  isCurrentUserVotesOnProposalLoading: boolean;
  isCurrentUserVotesOnProposalSuccess: boolean;
  isCurrentUserVotesOnProposalError: boolean;
  setCurrentUserQualifiedToSubmit: (value: boolean) => void;
  setCurrentUserQualifiedToVote: (value: boolean) => void;
  setCurrentuserTotalVotesCast: (amount: number) => void;
  setCurrentUserAvailableVotesAmount: (amount: number) => void;
  setCurrentUserTotalVotesAmount: (amount: number) => void;
  setContestMaxNumberSubmissionsPerUser: (amount: number) => void;
  decreaseCurrentUserAvailableVotesAmount: (amount: number) => void;
  increaseCurrentUserProposalCount: () => void;
  increaseCurrentUserAvailableVotesAmount: (amount: number) => void;
  increaseCurrentUserTotalVotesCast: (amount: number) => void;
  decreaseCurrentUserTotalVotesCast: (amount: number) => void;
  increaseCurrentUserVotesOnProposal: (amount: number) => void;
  decreaseCurrentUserVotesOnProposal: (amount: number) => void;
  setCurrentUserProposalCount: (amount: number) => void;
  setCurrentUserVotesOnProposal: (amount: number) => void;
  setIsCurrentUserSubmitQualificationLoading: (value: boolean) => void;
  setIsCurrentUserSubmitQualificationSuccess: (value: boolean) => void;
  setIsCurrentUserSubmitQualificationError: (value: boolean) => void;
  setIsCurrentUserVoteQualificationLoading: (value: boolean) => void;
  setIsCurrentUserVoteQualificationSuccess: (value: boolean) => void;
  setIsCurrentUserVoteQualificationError: (value: boolean) => void;
  setIsCurrentUserVotesOnProposalLoading: (value: boolean) => void;
  setIsCurrentUserVotesOnProposalSuccess: (value: boolean) => void;
  setIsCurrentUserVotesOnProposalError: (value: boolean) => void;
}

export const createUserStore = () =>
  createStore<UserState>(set => ({
    currentUserQualifiedToSubmit: false,
    currentUserQualifiedToVote: false,
    currentUserAvailableVotesAmount: 0,
    currentUserTotalVotesAmount: 0,
    currentUserTotalVotesCast: 0,
    contestMaxNumberSubmissionsPerUser: 0,
    currentUserProposalCount: 0,
    currentUserVotesOnProposal: 0,
    isLoading: false,
    isSuccess: false,
    error: "",
    isCurrentUserSubmitQualificationLoading: false,
    isCurrentUserSubmitQualificationSuccess: false,
    isCurrentUserSubmitQualificationError: false,
    isCurrentUserVoteQualificationLoading: false,
    isCurrentUserVoteQualificationSuccess: false,
    isCurrentUserVoteQualificationError: false,
    isCurrentUserVotesOnProposalLoading: false,
    isCurrentUserVotesOnProposalSuccess: false,
    isCurrentUserVotesOnProposalError: false,
    setCurrentUserQualifiedToSubmit: value => set({ currentUserQualifiedToSubmit: value }),
    setCurrentUserQualifiedToVote: value => set({ currentUserQualifiedToVote: value }),
    setCurrentuserTotalVotesCast: amount => set({ currentUserTotalVotesCast: amount }),
    setCurrentUserAvailableVotesAmount: amount => set({ currentUserAvailableVotesAmount: amount }),
    setCurrentUserTotalVotesAmount: amount => set({ currentUserTotalVotesAmount: amount }),
    setContestMaxNumberSubmissionsPerUser: amount => set({ contestMaxNumberSubmissionsPerUser: amount }),
    setCurrentUserProposalCount: amount => set({ currentUserProposalCount: amount }),
    setCurrentUserVotesOnProposal: amount => set({ currentUserVotesOnProposal: amount }),
    decreaseCurrentUserAvailableVotesAmount: (amount: number) =>
      set(state => ({ currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount - amount })),
    increaseCurrentUserAvailableVotesAmount: (amount: number) =>
      set(state => ({ currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount + amount })),
    increaseCurrentUserTotalVotesCast: (amount: number) =>
      set(state => ({ currentUserTotalVotesCast: state.currentUserTotalVotesCast + amount })),
    decreaseCurrentUserTotalVotesCast: (amount: number) =>
      set(state => ({ currentUserTotalVotesCast: state.currentUserTotalVotesCast - amount })),
    increaseCurrentUserProposalCount: () =>
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
    increaseCurrentUserVotesOnProposal: (amount: number) =>
      set(state => ({ currentUserVotesOnProposal: state.currentUserVotesOnProposal + amount })),
    decreaseCurrentUserVotesOnProposal: (amount: number) =>
      set(state => ({ currentUserVotesOnProposal: state.currentUserVotesOnProposal - amount })),
    setIsCurrentUserSubmitQualificationLoading: value => set({ isCurrentUserSubmitQualificationLoading: value }),
    setIsCurrentUserSubmitQualificationSuccess: value => set({ isCurrentUserSubmitQualificationSuccess: value }),
    setIsCurrentUserSubmitQualificationError: value => set({ isCurrentUserSubmitQualificationError: value }),
    setIsCurrentUserVoteQualificationLoading: value => set({ isCurrentUserVoteQualificationLoading: value }),
    setIsCurrentUserVoteQualificationSuccess: value => set({ isCurrentUserVoteQualificationSuccess: value }),
    setIsCurrentUserVoteQualificationError: value => set({ isCurrentUserVoteQualificationError: value }),
    setIsCurrentUserVotesOnProposalLoading: value => set({ isCurrentUserVotesOnProposalLoading: value }),
    setIsCurrentUserVotesOnProposalSuccess: value => set({ isCurrentUserVotesOnProposalSuccess: value }),
    setIsCurrentUserVotesOnProposalError: value => set({ isCurrentUserVotesOnProposalError: value }),
  }));

export const UserContext = createContext<ReturnType<typeof createUserStore> | null>(null);

export function UserWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createUserStore>>();
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }
  return <UserContext.Provider value={storeRef.current}>{children}</UserContext.Provider>;
}

export function useUserStore<T>(selector: (state: UserState) => T) {
  const store = useContext(UserContext);
  if (store === null) {
    throw new Error("Missing UserWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
