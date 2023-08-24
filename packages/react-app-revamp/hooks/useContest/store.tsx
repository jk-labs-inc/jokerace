import { Recipient } from "lib/merkletree/generateMerkleTree";
import { createContext, useContext, useRef } from "react";
import { CustomError } from "types/error";
import { createStore, useStore } from "zustand";

type Reward = {
  token: {
    symbol: string;
    value: number;
  };
  winners: number;
  numberOfTokens: number;
};

export interface ContestState {
  contestName: string;
  contestPrompt: string;
  contestAuthorEthereumAddress: string;
  contestAuthor: string;
  submissionsOpen: Date;
  votesOpen: Date;
  votesClose: Date;
  totalVotesCast: number;
  totalVotes: number;
  isLoading: boolean;
  error: CustomError | null;
  isSuccess: boolean;
  isV3: boolean;
  contestMaxProposalCount: number;
  downvotingAllowed: boolean;
  canUpdateVotesInRealTime: boolean;
  supportsRewardsModule: boolean;
  submissionMerkleRoot: string;
  submitters: {
    address: string;
  }[];
  voters: Recipient[];
  rewards: Reward | null;
  isReadOnly: boolean;
  isRewardsLoading: boolean;
  setSupportsRewardsModule: (value: boolean) => void;
  setCanUpdateVotesInRealTime: (value: boolean) => void;
  setDownvotingAllowed: (isAllowed: boolean) => void;
  setContestPrompt: (prompt: string) => void;
  setContestMaxProposalCount: (amount: number) => void;
  setContestName: (name: string) => void;
  setContestAuthor: (author: string, address: string) => void;
  setSubmissionsOpen: (datetime: Date) => void;
  setVotesOpen: (datetime: Date) => void;
  setVotesClose: (datetime: Date) => void;
  setTotalVotesCast: (amount: number) => void;
  setTotalVotes: (amount: number) => void;
  setRewards: (rewards: Reward | null) => void;
  setVoters: (voters: Recipient[]) => void;
  setSubmitters: (submitters: { address: string }[]) => void;
  setSubmissionMerkleRoot: (root: string) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: CustomError | null) => void;
  setIsSuccess: (value: boolean) => void;
  setIsV3: (value: boolean) => void;
  setIsReadOnly: (value: boolean) => void;
  setIsRewardsLoading: (value: boolean) => void;
}

export const createContestStore = () =>
  createStore<ContestState>(set => ({
    contestName: "",
    contestPrompt: "",
    contestAuthorEthereumAddress: "",
    contestAuthor: "",
    submissionsOpen: new Date(),
    votesOpen: new Date(),
    votesClose: new Date(),
    submissionMerkleRoot: "",
    submitters: [],
    voters: [],
    totalVotesCast: 0,
    rewards: null,
    totalVotes: 0,
    isLoading: true,
    error: null,
    isSuccess: false,
    contestMaxProposalCount: 0,
    downvotingAllowed: false,
    canUpdateVotesInRealTime: false,
    isV3: false,
    isReadOnly: false,
    supportsRewardsModule: false,
    isRewardsLoading: false,
    setSupportsRewardsModule: value => set({ supportsRewardsModule: value }),
    setCanUpdateVotesInRealTime: value => set({ canUpdateVotesInRealTime: value }),
    setDownvotingAllowed: isAllowed => set({ downvotingAllowed: isAllowed }),
    setContestPrompt: prompt => set({ contestPrompt: prompt }),
    setContestMaxProposalCount: amount => set({ contestMaxProposalCount: amount }),
    setIsV3: value => set({ isV3: value }),
    setIsReadOnly: value => set({ isReadOnly: value }),
    setContestName: name => set({ contestName: name }),
    setContestAuthor: (author, address) => set({ contestAuthor: author, contestAuthorEthereumAddress: address }),
    setSubmissionsOpen: datetime => set({ submissionsOpen: datetime }),
    setVotesOpen: datetime => set({ votesOpen: datetime }),
    setVotesClose: datetime => set({ votesClose: datetime }),
    setVoters: voters => set({ voters: voters }),
    setSubmitters: submitters => set({ submitters: submitters }),
    setSubmissionMerkleRoot: root => set({ submissionMerkleRoot: root }),
    setTotalVotesCast: amount => set({ totalVotesCast: amount }),
    setTotalVotes: amount => set({ totalVotes: amount }),
    setRewards: rewards => set({ rewards: rewards }),
    setIsLoading: value => set({ isLoading: value }),
    setError: value => set({ error: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setIsRewardsLoading: value => set({ isRewardsLoading: value }),
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
