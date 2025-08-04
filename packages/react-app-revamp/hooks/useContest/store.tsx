import { Charge, VotingRequirementsSchema } from "@hooks/useDeployContest/types";
import { createContext, useContext, useRef } from "react";
import { Abi } from "viem";
import { createStore, useStore } from "zustand";

export enum ErrorType {
  RPC = "RPC",
  CONTRACT = "CONTRACT",
  IS_NOT_JOKERACE_CONTRACT = "IS_NOT_JOKERACE_CONTRACT",
}

export interface ContestInfoData {
  contestAddress: string;
  contestChainName: string;
  contestChainId: number;
  contestChainNativeCurrencySymbol: string;
}

export interface ContestState {
  contestName: string;
  contestInfoData: ContestInfoData;
  contestPrompt: string;
  contestAbi: Abi;
  contestAuthorEthereumAddress: string;
  contestAuthor: string;
  submissionsOpen: Date;
  votesOpen: Date;
  votesClose: Date;
  isLoading: boolean;
  error: ErrorType | null;
  isSuccess: boolean;
  isV3: boolean;
  contestMaxProposalCount: number;
  sortingEnabled: boolean;
  submissionMerkleRoot: string;
  votingMerkleRoot: string;
  charge: Charge | null;
  votingRequirements: VotingRequirementsSchema | null;
  submissionRequirements: VotingRequirementsSchema | null;
  isReadOnly: boolean;
  anyoneCanVote: boolean;
  version: string;
  canEditTitleAndDescription: boolean;
  rewardsModuleAddress: string;
  setSortingEnabled: (isAllowed: boolean) => void;
  setContestPrompt: (prompt: string) => void;
  setContestMaxProposalCount: (amount: number) => void;
  setContestName: (name: string) => void;
  setContestAuthor: (author: string, address: string) => void;
  setSubmissionsOpen: (datetime: Date) => void;
  setVotesOpen: (datetime: Date) => void;
  setVotesClose: (datetime: Date) => void;
  setSubmissionsMerkleRoot: (merkleRoot: string) => void;
  setVotingMerkleRoot: (merkleRoot: string) => void;
  setVotingRequirements: (votingRequirements: VotingRequirementsSchema | null) => void;
  setSubmissionRequirements: (submissionRequirements: VotingRequirementsSchema | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: ErrorType | null) => void;
  setIsSuccess: (value: boolean) => void;
  setIsV3: (value: boolean) => void;
  setCharge: (charge: Charge | null) => void;
  setIsReadOnly: (value: boolean) => void;
  setContestAbi: (abi: Abi) => void;
  setAnyoneCanVote: (value: boolean) => void;
  setVersion: (version: string) => void;
  setCanEditTitleAndDescription: (value: boolean) => void;
  setRewardsModuleAddress: (address: string) => void;
  setContestInfoData: (contestInfoData: ContestInfoData) => void;
  getTotalVotingMinutes: () => number;
  getCurrentVotingMinute: () => number;
}

export const createContestStore = () =>
  createStore<ContestState>((set, get) => ({
    contestName: "",
    contestInfoData: {
      contestAddress: "",
      contestChainName: "",
      contestChainId: 0,
      contestChainNativeCurrencySymbol: "",
    },
    contestPrompt: "",
    contestAbi: [],
    contestAuthorEthereumAddress: "",
    contestAuthor: "",
    submissionsOpen: new Date(),
    votesOpen: new Date(),
    votesClose: new Date(),
    submissionMerkleRoot: "",
    votingMerkleRoot: "",
    isLoading: true,
    error: null,
    charge: null,
    isSuccess: false,
    contestMaxProposalCount: 0,
    sortingEnabled: false,
    votingRequirements: null,
    submissionRequirements: null,
    isV3: false,
    isReadOnly: false,
    anyoneCanVote: false,
    version: "",
    canEditTitleAndDescription: false,
    rewardsModuleAddress: "",
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
    setVotingRequirements: votingRequirements => set({ votingRequirements: votingRequirements }),
    setSubmissionRequirements: submissionRequirements => set({ submissionRequirements: submissionRequirements }),
    setIsLoading: value => set({ isLoading: value }),
    setError: value => set({ error: value }),
    setIsSuccess: value => set({ isSuccess: value }),
    setCharge: charge => set({ charge: charge }),
    setContestAbi: abi => set({ contestAbi: abi }),
    setAnyoneCanVote: value => set({ anyoneCanVote: value }),
    setVersion: version => set({ version: version }),
    setCanEditTitleAndDescription: value => set({ canEditTitleAndDescription: value }),
    setRewardsModuleAddress: address => set({ rewardsModuleAddress: address }),
    setContestInfoData: contestInfoData => set({ contestInfoData: contestInfoData }),
    getTotalVotingMinutes: () => {
      const state = get();
      const diffMs = state.votesClose.getTime() - state.votesOpen.getTime();
      return Math.floor(diffMs / (1000 * 60)); // Convert to minutes
    },

    getCurrentVotingMinute: () => {
      const state = get();
      const now = new Date();
      const diffMs = now.getTime() - state.votesOpen.getTime();
      const currentMinute = Math.floor(diffMs / (1000 * 60)); // Convert to minutes

      // Ensure we don't go below 0 or above total minutes
      const totalMinutes = state.getTotalVotingMinutes();
      return Math.max(0, Math.min(currentMinute, totalMinutes));
    },
  }));

export const ContestContext = createContext<ReturnType<typeof createContestStore> | null>(null);

export function ContestWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createContestStore>>(createContestStore());
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
