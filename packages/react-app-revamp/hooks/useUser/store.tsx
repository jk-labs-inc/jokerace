import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

enum AnyoneCanSubmit {
  ONLY_CREATOR = "ONLY_CREATOR",
  ANYONE_CAN_SUBMIT = "ANYONE_CAN_SUBMIT",
}

interface UserState {
  anyoneCanSubmit: AnyoneCanSubmit;
  currentUserQualifiedToSubmit: boolean;
  currentUserQualifiedToVote: boolean;
  currentUserTotalVotesAmount: number;
  currentUserAvailableVotesAmount: number;
  contestMaxNumberSubmissionsPerUser: number;
  currentUserProposalCount: number;
  currentUserTotalVotesCast: number;
  isCurrentUserSubmitQualificationLoading: boolean;
  isCurrentUserSubmitQualificationSuccess: boolean;
  isCurrentUserSubmitQualificationError: boolean;
  isCurrentUserVoteQualificationLoading: boolean;
  isCurrentUserVoteQualificationSuccess: boolean;
  isCurrentUserVoteQualificationError: boolean;
  setCurrentUserQualifiedToSubmit: (value: boolean) => void;
  setCurrentUserQualifiedToVote: (value: boolean) => void;
  setCurrentuserTotalVotesCast: (amount: number) => void;
  setCurrentUserAvailableVotesAmount: (amount: number) => void;
  setCurrentUserTotalVotesAmount: (amount: number) => void;
  setContestMaxNumberSubmissionsPerUser: (amount: number) => void;
  increaseCurrentUserProposalCount: () => void;
  setCurrentUserProposalCount: (amount: number) => void;
  setIsCurrentUserSubmitQualificationLoading: (value: boolean) => void;
  setIsCurrentUserSubmitQualificationSuccess: (value: boolean) => void;
  setIsCurrentUserSubmitQualificationError: (value: boolean) => void;
  setIsCurrentUserVoteQualificationLoading: (value: boolean) => void;
  setIsCurrentUserVoteQualificationSuccess: (value: boolean) => void;
  setIsCurrentUserVoteQualificationError: (value: boolean) => void;
  setAnyoneCanSubmit: (value: AnyoneCanSubmit) => void;
}

export const createUserStore = () =>
  createStore<UserState>(set => ({
    anyoneCanSubmit: AnyoneCanSubmit.ANYONE_CAN_SUBMIT,
    currentUserQualifiedToSubmit: false,
    currentUserQualifiedToVote: false,
    currentUserAvailableVotesAmount: 0,
    currentUserTotalVotesAmount: 0,
    currentUserTotalVotesCast: 0,
    contestMaxNumberSubmissionsPerUser: 0,
    currentUserProposalCount: 0,
    isLoading: false,
    isSuccess: false,
    error: "",
    isCurrentUserSubmitQualificationLoading: false,
    isCurrentUserSubmitQualificationSuccess: false,
    isCurrentUserSubmitQualificationError: false,
    isCurrentUserVoteQualificationLoading: false,
    isCurrentUserVoteQualificationSuccess: false,
    isCurrentUserVoteQualificationError: false,
    setAnyoneCanSubmit: value => set({ anyoneCanSubmit: value }),
    setCurrentUserQualifiedToSubmit: value => set({ currentUserQualifiedToSubmit: value }),
    setCurrentUserQualifiedToVote: value => set({ currentUserQualifiedToVote: value }),
    setCurrentuserTotalVotesCast: amount => set({ currentUserTotalVotesCast: amount }),
    setCurrentUserAvailableVotesAmount: amount => set({ currentUserAvailableVotesAmount: amount }),
    setCurrentUserTotalVotesAmount: amount => set({ currentUserTotalVotesAmount: amount }),
    setContestMaxNumberSubmissionsPerUser: amount => set({ contestMaxNumberSubmissionsPerUser: amount }),
    setCurrentUserProposalCount: amount => set({ currentUserProposalCount: amount }),
    increaseCurrentUserProposalCount: () =>
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
    setIsCurrentUserSubmitQualificationLoading: value => set({ isCurrentUserSubmitQualificationLoading: value }),
    setIsCurrentUserSubmitQualificationSuccess: value => set({ isCurrentUserSubmitQualificationSuccess: value }),
    setIsCurrentUserSubmitQualificationError: value => set({ isCurrentUserSubmitQualificationError: value }),
    setIsCurrentUserVoteQualificationLoading: value => set({ isCurrentUserVoteQualificationLoading: value }),
    setIsCurrentUserVoteQualificationSuccess: value => set({ isCurrentUserVoteQualificationSuccess: value }),
    setIsCurrentUserVoteQualificationError: value => set({ isCurrentUserVoteQualificationError: value }),
  }));

export const UserContext = createContext<ReturnType<typeof createUserStore> | null>(null);

export function UserWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createUserStore>>(createUserStore());
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
