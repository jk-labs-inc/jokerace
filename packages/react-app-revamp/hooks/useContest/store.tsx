import { VotingRequirementsSchema } from "@hooks/useContestsIndexV3";
import { Charge } from "@hooks/useDeployContest/types";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

export type Reward = {
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
  isLoading: boolean;
  error: string;
  isSuccess: boolean;
  isV3: boolean;
  contestMaxProposalCount: number;
  downvotingAllowed: boolean;
  sortingEnabled: boolean;
  canUpdateVotesInRealTime: boolean;
  supportsRewardsModule: boolean;
  submissionMerkleRoot: string;
  votingMerkleRoot: string;
  charge: Charge | null;
  votingRequirements: VotingRequirementsSchema | null;
  submissionRequirements: VotingRequirementsSchema | null;
  rewards: Reward | null;
  isReadOnly: boolean;
  isRewardsLoading: boolean;
  setSupportsRewardsModule: (value: boolean) => void;
  setCanUpdateVotesInRealTime: (value: boolean) => void;
  setDownvotingAllowed: (isAllowed: boolean) => void;
  setSortingEnabled: (isAllowed: boolean) => void;
  setContestPrompt: (prompt: string) => void;
  setContestMaxProposalCount: (amount: number) => void;
  setContestName: (name: string) => void;
  setContestAuthor: (author: string, address: string) => void;
  setSubmissionsOpen: (datetime: Date) => void;
  setVotesOpen: (datetime: Date) => void;
  setVotesClose: (datetime: Date) => void;
  setRewards: (rewards: Reward | null) => void;
  setSubmissionsMerkleRoot: (merkleRoot: string) => void;
  setVotingMerkleRoot: (merkleRoot: string) => void;
  setVotingRequirements: (votingRequirements: VotingRequirementsSchema | null) => void;
  setSubmissionRequirements: (submissionRequirements: VotingRequirementsSchema | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string) => void;
  setIsSuccess: (value: boolean) => void;
  setIsV3: (value: boolean) => void;
  setCharge: (charge: Charge | null) => void;
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
    votingMerkleRoot: "",
    rewards: null,
    isLoading: true,
    error: "",
    charge: null,
    isSuccess: false,
    contestMaxProposalCount: 0,
    downvotingAllowed: false,
    sortingEnabled: false,
    canUpdateVotesInRealTime: false,
    votingRequirements: null,
    submissionRequirements: null,
    isV3: false,
    isReadOnly: false,
    supportsRewardsModule: false,
    isRewardsLoading: false,
    setSupportsRewardsModule: value => set({ supportsRewardsModule: value }),
    setCanUpdateVotesInRealTime: value => set({ canUpdateVotesInRealTime: value }),
    setDownvotingAllowed: isAllowed => set({ downvotingAllowed: isAllowed }),
    setSortingEnabled: isAllowed => set({ sortingEnabled: isAllowed }),
    setContestPrompt: prompt => set({ contestPrompt: prompt }),
    setContestMaxProposalCount: amount => set({ contestMaxProposalCount: amount }),
    setIsV3: value => set({ isV3: value }),
    setIsReadOnly: value => set({ isReadOnly: value }),
    setContestName: name => set({ contestName: name }),
    setContestAuthor: (author, address) => set({ contestAuthor: author, contestAuthorEthereumAddress: address }),
    setSubmissionsOpen: datetime => set({ submissionsOpen: datetime }),
    setVotesOpen: datetime => set({ votesOpen: datetime }),
    setVotesClose: datetime => set({ votesClose: datetime }),
    setSubmissionsMerkleRoot: merkleRoot => set({ submissionMerkleRoot: merkleRoot }),
    setVotingMerkleRoot: merkleRoot => set({ votingMerkleRoot: merkleRoot }),
    setRewards: rewards => set({ rewards: rewards }),
    setVotingRequirements: votingRequirements => set({ votingRequirements: votingRequirements }),
    setSubmissionRequirements: submissionRequirements => set({ submissionRequirements: submissionRequirements }),
    setIsLoading: value => set({ isLoading: value }),
    setError: value => set({ error: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setIsRewardsLoading: value => set({ isRewardsLoading: value }),
    setCharge: charge => set({ charge: charge }),
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
