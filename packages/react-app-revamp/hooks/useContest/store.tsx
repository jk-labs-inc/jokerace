import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

export interface ContestState {
  contestName: string;
  contestPrompt: string;
  contestAuthorEthereumAddress: string;
  contestAuthor: string;
  contestStatus: number;
  submissionsOpen: Date;
  votesOpen: Date;
  votesClose: Date;
  votingToken: any | null;
  votingTokenAddress: any | null;
  submitProposalToken: any | null;
  submitProposalTokenAddress: any | null;
  isLoading: boolean;
  isError: string | null;
  isSuccess: boolean;
  contestMaxProposalCount: number;
  snapshotTaken: boolean;
  downvotingAllowed: boolean;
  canUpdateVotesInRealTime: boolean;
  supportsRewardsModule: boolean;

  setSupportsRewardsModule: (value: boolean) => void;
  setCanUpdateVotesInRealTime: (value: boolean) => void;
  setDownvotingAllowed: (isAllowed: boolean) => void;
  setContestPrompt: (prompt: string) => void;
  setContestMaxProposalCount: (amount: number) => void;
  setContestStatus: (status: number) => void;
  setContestName: (name: string) => void;
  setContestAuthor: (author: string, address: string) => void;
  setSubmissionsOpen: (datetime: Date) => void;
  setVotesOpen: (datetime: Date) => void;
  setVotesClose: (datetime: Date) => void;
  setVotingToken: (token: any) => void;
  setVotingTokenAddress: (address: any) => void;
  setSubmitProposalToken: (token: any) => void;
  setSubmitProposalTokenAddress: (address: any) => void;
  setSnapshotTaken: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setIsError: (value: string | null) => void;
  setIsSuccess: (value: boolean) => void;
}

export const createContestStore = () =>
  createStore<ContestState>(set => ({
    contestName: "",
    contestPrompt: "",
    contestAuthorEthereumAddress: "",
    contestAuthor: "",
    contestStatus: 0,
    submissionsOpen: new Date(),
    votesOpen: new Date(),
    votesClose: new Date(),
    votingToken: null,
    votingTokenAddress: null,
    submitProposalToken: null,
    submitProposalTokenAddress: null,
    isLoading: true,
    isError: null,
    isSuccess: false,
    contestMaxProposalCount: 0,
    snapshotTaken: false,
    downvotingAllowed: false,
    canUpdateVotesInRealTime: false,
    supportsRewardsModule: false,
    setSupportsRewardsModule: (value: boolean) => set({ supportsRewardsModule: value }),
    setCanUpdateVotesInRealTime: (value: boolean) => set({ canUpdateVotesInRealTime: value }),

    setDownvotingAllowed: (isAllowed: boolean) => set({ downvotingAllowed: isAllowed }),
    setContestPrompt: (prompt: string) => set({ contestPrompt: prompt }),

    setContestMaxProposalCount: (amount: number) => set({ contestMaxProposalCount: amount }),

    setContestStatus: (status: number) => set({ contestStatus: status }),
    setContestName: (name: string) => set({ contestName: name }),
    setContestAuthor: (author: string, address: string) =>
      set({ contestAuthor: author, contestAuthorEthereumAddress: address }),
    setSubmissionsOpen: (datetime: Date) => set({ submissionsOpen: datetime }),
    setVotesOpen: (datetime: Date) => set({ votesOpen: datetime }),
    setVotesClose: (datetime: Date) => set({ votesClose: datetime }),
    setVotingToken: (token: any) => set({ votingToken: token }),
    setVotingTokenAddress: (address: any) => set({ votingTokenAddress: address }),
    setSubmitProposalToken: (token: any) => set({ submitProposalToken: token }),
    setSubmitProposalTokenAddress: (address: any) => set({ submitProposalTokenAddress: address }),
    setSnapshotTaken: (value: boolean) => set({ snapshotTaken: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setIsError: (value: string | null) => set({ isError: value }),
    setIsSuccess: (value: boolean) => set({ isSuccess: value }),
  }));

export const ContestContext = createContext<ReturnType<typeof createContestStore> | null>(null);

export function ContestWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createContestStore>>();
  if (!storeRef.current) {
    storeRef.current = createContestStore();
  }
  return <ContestContext.Provider value={storeRef.current}>{children}</ContestContext.Provider>;
}

export function useContestStore<T>(selector: (state: ContestState) => T) {
  const store = useContext(ContestContext);
  if (store === null) {
    throw new Error("Missing ContestWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
