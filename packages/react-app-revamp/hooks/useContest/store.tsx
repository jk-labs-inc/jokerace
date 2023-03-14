import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

export interface ContestState {
  contestName: string;
  contestPrompt: string;
  contestAuthorEthereumAddress: string;
  contestAuthor: string;
  contestStatus: number;
  submissionsOpen: Date | null;
  votesOpen: Date | null;
  votesClose: Date | null;
  votingToken: any | null;
  votingTokenAddress: any | null;
  submitProposalToken: any | null;
  submitProposalTokenAddress: any | null;
  isLoading: boolean;
  error: CustomError | null;
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
  setError: (value: CustomError | null) => void;
  setIsSuccess: (value: boolean) => void;
}

export const createContestStore = () =>
  createStore<ContestState>(set => ({
    contestName: "",
    contestPrompt: "",
    contestAuthorEthereumAddress: "",
    contestAuthor: "",
    contestStatus: 0,
    submissionsOpen: null,
    votesOpen: null,
    votesClose: null,
    votingToken: null,
    votingTokenAddress: null,
    submitProposalToken: null,
    submitProposalTokenAddress: null,
    isLoading: true,
    error: null,
    isSuccess: false,
    contestMaxProposalCount: 0,
    snapshotTaken: false,
    downvotingAllowed: false,
    canUpdateVotesInRealTime: false,
    supportsRewardsModule: false,
    setSupportsRewardsModule: value => set({ supportsRewardsModule: value }),
    setCanUpdateVotesInRealTime: value => set({ canUpdateVotesInRealTime: value }),

    setDownvotingAllowed: isAllowed => set({ downvotingAllowed: isAllowed }),
    setContestPrompt: prompt => set({ contestPrompt: prompt }),

    setContestMaxProposalCount: amount => set({ contestMaxProposalCount: amount }),

    setContestStatus: status => set({ contestStatus: status }),
    setContestName: name => set({ contestName: name }),
    setContestAuthor: (author, address) => set({ contestAuthor: author, contestAuthorEthereumAddress: address }),
    setSubmissionsOpen: datetime => set({ submissionsOpen: datetime }),
    setVotesOpen: datetime => set({ votesOpen: datetime }),
    setVotesClose: datetime => set({ votesClose: datetime }),
    setVotingToken: token => set({ votingToken: token }),
    setVotingTokenAddress: address => set({ votingTokenAddress: address }),
    setSubmitProposalToken: token => set({ submitProposalToken: token }),
    setSubmitProposalTokenAddress: address => set({ submitProposalTokenAddress: address }),
    setSnapshotTaken: value => set({ snapshotTaken: value }),
    setIsLoading: value => set({ isLoading: value }),
    setError: value => set({ error: value }),
    setIsSuccess: value => set({ isSuccess: value }),
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
