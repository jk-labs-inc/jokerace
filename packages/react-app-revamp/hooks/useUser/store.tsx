import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface UserState {
  currentUserAvailableVotesAmount: number;
  contestMaxNumberSubmissionsPerUser: number;
  currentUserTotalVotesCast: number;
  currentUserProposalCount: number;
  amountOfTokensRequiredToSubmitEntry: number;
  usersQualifyToVoteIfTheyHoldTokenAtTime: Date;
  didUserPassSnapshotAndCanVote: boolean;
  checkIfUserPassedSnapshotLoading: boolean;
  currentUserSubmitProposalTokensAmount: number;

  setCurrentUserAvailableVotesAmount: (amount: number) => void;
  setCurrentUserTotalVotesCast: (amount: number) => void;
  setAmountOfTokensRequiredToSubmitEntry: (amount: number) => void;
  setContestMaxNumberSubmissionsPerUser: (amount: number) => void;
  setCurrentUserProposalCount: (amount: number) => void;
  setUsersQualifyToVoteIfTheyHoldTokenAtTime: (value: Date) => void;
  setDidUserPassSnapshotAndCanVote: (value: boolean) => void;
  setCheckIfUserPassedSnapshotLoading: (value: boolean) => void;
  setCurrentUserSubmitProposalTokensAmount: (amount: number) => void;
  increaseCurrentUserProposalCount: () => void;
}

export const createUserStore = () =>
  createStore<UserState>(set => ({
    currentUserAvailableVotesAmount: 0,
    contestMaxNumberSubmissionsPerUser: 0,
    currentUserTotalVotesCast: 0,
    currentUserProposalCount: 0,
    amountOfTokensRequiredToSubmitEntry: 0,
    usersQualifyToVoteIfTheyHoldTokenAtTime: new Date(),
    didUserPassSnapshotAndCanVote: false,
    checkIfUserPassedSnapshotLoading: true,
    currentUserSubmitProposalTokensAmount: 0,

    setCurrentUserAvailableVotesAmount: amount => set({ currentUserAvailableVotesAmount: amount }),
    setCurrentUserTotalVotesCast: amount => set({ currentUserTotalVotesCast: amount }),
    setAmountOfTokensRequiredToSubmitEntry: amount => set({ amountOfTokensRequiredToSubmitEntry: amount }),
    setContestMaxNumberSubmissionsPerUser: amount => set({ contestMaxNumberSubmissionsPerUser: amount }),
    setCurrentUserProposalCount: amount => set({ currentUserProposalCount: amount }),
    setUsersQualifyToVoteIfTheyHoldTokenAtTime: value => set({ usersQualifyToVoteIfTheyHoldTokenAtTime: value }),
    setDidUserPassSnapshotAndCanVote: value => set({ didUserPassSnapshotAndCanVote: value }),
    setCheckIfUserPassedSnapshotLoading: value => set({ checkIfUserPassedSnapshotLoading: value }),
    setCurrentUserSubmitProposalTokensAmount: amount => set({ currentUserSubmitProposalTokensAmount: amount }),
    increaseCurrentUserProposalCount: () =>
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
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
