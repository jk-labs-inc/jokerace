import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

export enum AnyoneCanSubmit {
  ONLY_CREATOR = "ONLY_CREATOR",
  ANYONE_CAN_SUBMIT = "ANYONE_CAN_SUBMIT",
}

interface UserState {
  anyoneCanSubmit: AnyoneCanSubmit;
  currentUserQualifiedToSubmit: boolean;
  contestMaxNumberSubmissionsPerUser: number;
  currentUserProposalCount: number;
  isCurrentUserSubmitQualificationLoading: boolean;
  isCurrentUserSubmitQualificationSuccess: boolean;
  isCurrentUserSubmitQualificationError: boolean;
  setCurrentUserQualifiedToSubmit: (value: boolean) => void;
  setContestMaxNumberSubmissionsPerUser: (amount: number) => void;
  increaseCurrentUserProposalCount: () => void;
  setCurrentUserProposalCount: (amount: number) => void;
  setIsCurrentUserSubmitQualificationLoading: (value: boolean) => void;
  setIsCurrentUserSubmitQualificationSuccess: (value: boolean) => void;
  setIsCurrentUserSubmitQualificationError: (value: boolean) => void;
  setAnyoneCanSubmit: (value: AnyoneCanSubmit) => void;
}

export const createUserStore = () =>
  createStore<UserState>(set => ({
    anyoneCanSubmit: AnyoneCanSubmit.ANYONE_CAN_SUBMIT,
    currentUserQualifiedToSubmit: false,
    contestMaxNumberSubmissionsPerUser: 0,
    currentUserProposalCount: 0,
    isCurrentUserSubmitQualificationLoading: false,
    isCurrentUserSubmitQualificationSuccess: false,
    isCurrentUserSubmitQualificationError: false,
    setAnyoneCanSubmit: value => set({ anyoneCanSubmit: value }),
    setCurrentUserQualifiedToSubmit: value => set({ currentUserQualifiedToSubmit: value }),
    setContestMaxNumberSubmissionsPerUser: amount => set({ contestMaxNumberSubmissionsPerUser: amount }),
    setCurrentUserProposalCount: amount => set({ currentUserProposalCount: amount }),
    increaseCurrentUserProposalCount: () =>
      set(state => ({ currentUserProposalCount: state.currentUserProposalCount + 1 })),
    setIsCurrentUserSubmitQualificationLoading: value => set({ isCurrentUserSubmitQualificationLoading: value }),
    setIsCurrentUserSubmitQualificationSuccess: value => set({ isCurrentUserSubmitQualificationSuccess: value }),
    setIsCurrentUserSubmitQualificationError: value => set({ isCurrentUserSubmitQualificationError: value }),
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
