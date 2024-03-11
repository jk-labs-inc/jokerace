import { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { EMPTY_FIELDS_SUBMISSION, EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { SubmissionFieldObject } from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor";
import { VotingFieldObject } from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor";
import { create } from "zustand";

import { DEFAULT_SUBMISSIONS } from ".";
import { Charge, SubmissionMerkle, SubmissionRequirements, VoteType, VotingMerkle, VotingRequirements } from "./types";

type ContestDeployError = {
  step: number;
  message: string;
};

export type Prompt = {
  summarize: string;
  evaluateVoters: string;
};

export enum ContestVisibility {
  Public = "public",
  Unlisted = "unlisted",
}

export type AdvancedOptions = {
  downvote: boolean;
  sorting: boolean;
  rankLimit: number;
  contestVisibility: ContestVisibility;
};

export type CustomizationOptions = {
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
};

export enum SubmissionType {
  DifferentFromVoters = 0,
  SameAsVoters = 1,
}

export interface SubmissionTypeOption {
  value: SubmissionType;
  label: string;
}

export type MerkleKey = "manual" | "prefilled" | "csv";

export interface DeployContestState {
  deployContestData: {
    chain: string;
    chainId: number;
    hash: string;
    address: string;
    downvote: boolean;
    sortingEnabled: boolean;
  };
  type: string;
  title: string;
  summary: string;
  prompt: Prompt;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingRequirements: VotingRequirements;
  submissionRequirementsOption: Option;
  votingRequirementsOption: Option;
  votingAllowlist: {
    manual: Record<string, number>;
    csv: Record<string, number>;
    prefilled: Record<string, number>;
  };
  votingMerkle: {
    manual: VotingMerkle | null;
    csv: VotingMerkle | null;
    prefilled: VotingMerkle | null;
  };
  votingAllowlistFields: VotingFieldObject[];
  submissionAllowlist: {
    manual: Record<string, number>;
    csv: Record<string, number>;
    prefilled: Record<string, number>;
  };
  submissionAllowlistFields: SubmissionFieldObject[];
  submissionMerkle: {
    manual: SubmissionMerkle | null;
    csv: SubmissionMerkle | null;
    prefilled: SubmissionMerkle | null;
  };
  submissionRequirements: SubmissionRequirements;
  submissionTypeOption: SubmissionTypeOption;
  customization: CustomizationOptions;
  advancedOptions: AdvancedOptions;
  isLoading: boolean;
  isSuccess: boolean;
  errors: ContestDeployError[];
  step: number;
  furthestStep: number;
  submissionTab: number;
  votingTab: number;
  charge: Charge;
  minCharge: {
    minCostToPropose: number;
    minCostToVote: number;
  };
  prevChainRefInCharge: string;
  setDeployContestData: (
    chain: string,
    chainId: number,
    hash: string,
    address: string,
    downvote: boolean,
    sortingEnabled: boolean,
  ) => void;
  setType: (type: string) => void;
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
  setPrompt: (prompt: Prompt) => void;
  setSubmissionOpen: (submissionOpen: Date) => void;
  setVotingOpen: (votingOpen: Date) => void;
  setVotingClose: (votingClose: Date) => void;
  setVotingRequirements: (votingRequirements: VotingRequirements) => void;
  setSubmissionRequirementsOption: (submissionRequirementsOption: Option) => void;
  setVotingRequirementsOption: (votingRequirementsOption: Option) => void;
  setVotingAllowlist: (type: MerkleKey, votingAllowlist: Record<string, number>) => void;
  setVotingMerkle: (type: MerkleKey, votingMerkle: VotingMerkle | null) => void;
  setVotingAllowlistFields: (votingAllowlistFields: VotingFieldObject[]) => void;
  setSubmissionAllowlist: (type: MerkleKey, submissionAllowlist: Record<string, number>) => void;
  setSubmissionMerkle: (type: MerkleKey, submissionMerkle: SubmissionMerkle | null) => void;
  setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) => void;
  setSubmissionRequirements: (submissionRequirements: SubmissionRequirements) => void;
  setSubmissionTypeOption: (submissionTypeOption: SubmissionTypeOption) => void;
  setCustomization: (customization: CustomizationOptions) => void;
  setAdvancedOptions: (advancedOptions: AdvancedOptions) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (step: number, error: ContestDeployError) => void;
  setStep: (step: number) => void;
  setFurthestStep: (furthestStep: number) => void;
  setSubmissionTab: (tab: number) => void;
  setVotingTab: (tab: number) => void;
  setCharge: (charge: Charge) => void;
  setMinCharge: (minCharge: { minCostToPropose: number; minCostToVote: number }) => void;
  setPrevChainRefInCharge: (chain: string) => void;
  reset: () => void;
}
export const useDeployContestStore = create<DeployContestState>((set, get) => {
  const initialSubmissionOpen: Date = new Date();

  const initialVotingOpen: Date = new Date();
  initialVotingOpen.setDate(initialVotingOpen.getDate() + 7);

  const initialVotingClose: Date = new Date();
  initialVotingClose.setDate(initialVotingClose.getDate() + 14);

  const initialState = {
    deployContestData: {
      chain: "",
      chainId: 0,
      hash: "",
      address: "",
      downvote: false,
      sortingEnabled: false,
    },
    type: "curation",
    title: "",
    summary: "",
    prompt: {
      summarize: "",
      evaluateVoters: "",
    },
    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,
    submissionRequirementsOption: {
      value: "anyone",
      label: "anyone",
    },
    votingRequirementsOption: {
      value: "erc20",
      label: "token holders",
    },
    votingAllowlist: {
      manual: {},
      csv: {},
      prefilled: {},
    },
    votingAllowlistFields: Array(15).fill(EMPTY_FIELDS_VOTING),
    votingMerkle: {
      manual: null,
      csv: null,
      prefilled: null,
    },
    votingRequirements: {
      type: "erc20",
      chain: "mainnet",
      tokenAddress: "",
      minTokensRequired: 0.01,
      powerType: "token",
      powerValue: 100,
      timestamp: Date.now(),
      name: "",
      symbol: "",
      logo: "",
    },
    submissionAllowlist: {
      manual: {},
      csv: {},
      prefilled: {},
    },
    submissionAllowlistFields: Array(15).fill(EMPTY_FIELDS_SUBMISSION),
    submissionMerkle: {
      manual: null,
      csv: null,
      prefilled: null,
    },
    submissionRequirements: {
      type: "erc20",
      chain: "mainnet",
      tokenAddress: "",
      minTokensRequired: 0.01,
      timestamp: Date.now(),
      name: "",
      symbol: "",
      logo: "",
    },
    submissionTypeOption: {
      value: SubmissionType.DifferentFromVoters,
      label: "different from voters",
    },
    charge: {
      percentageToCreator: 50,
      voteType: VoteType.PerTransaction,
      type: {
        costToPropose: 0,
        costToVote: 0,
      },
      error: false,
    },
    minCharge: {
      minCostToPropose: 0,
      minCostToVote: 0,
    },
    prevChainRefInCharge: "",
    customization: {
      allowedSubmissionsPerUser: 3,
      maxSubmissions: DEFAULT_SUBMISSIONS,
    },
    advancedOptions: {
      downvote: false,
      sorting: false,
      rankLimit: 250,
      contestVisibility: ContestVisibility.Public,
    },
    isLoading: false,
    isSuccess: false,
    errors: [],
    step: 0,
    furthestStep: 0,
    submissionTab: 0,
    votingTab: 0,
  };

  return {
    ...initialState,

    setDeployContestData: (
      chain: string,
      chainId: number,
      hash: string,
      address: string,
      downvote: boolean,
      sortingEnabled: boolean,
    ) => set({ deployContestData: { chain, chainId, hash, address, downvote, sortingEnabled } }),
    setType: (type: string) => set({ type }),
    setTitle: (title: string) => set({ title }),
    setSummary: (summary: string) => set({ summary }),
    setPrompt: (prompt: Prompt) => set({ prompt }),
    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
    setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
    setVotingClose: (votingClose: Date) => set({ votingClose }),
    setSubmissionRequirementsOption: (submissionRequirementsOption: Option) => set({ submissionRequirementsOption }),
    setVotingRequirementsOption: (votingRequirementsOption: Option) => set({ votingRequirementsOption }),
    setVotingAllowlist: (type, votingAllowlist) => {
      set(state => ({
        votingAllowlist: {
          ...state.votingAllowlist,
          [type]: votingAllowlist,
        },
      }));
    },
    setVotingMerkle: (type, votingMerkle) => {
      set(state => ({
        votingMerkle: {
          ...state.votingMerkle,
          [type]: votingMerkle,
        },
      }));
    },
    setVotingAllowlistFields: (votingAllowlistFields: VotingFieldObject[]) => set({ votingAllowlistFields }),
    setSubmissionAllowlist: (type, submissionAllowlist) => {
      set(state => ({
        submissionAllowlist: {
          ...state.submissionAllowlist,
          [type]: submissionAllowlist,
        },
      }));
    },
    setVotingRequirements: (votingRequirements: VotingRequirements) => set({ votingRequirements }),
    setSubmissionMerkle: (type, submissionMerkle) => {
      set(state => ({
        submissionMerkle: {
          ...state.submissionMerkle,
          [type]: submissionMerkle,
        },
      }));
    },
    setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) =>
      set({ submissionAllowlistFields }),
    setSubmissionRequirements: (submissionRequirements: SubmissionRequirements) => set({ submissionRequirements }),
    setSubmissionTypeOption: (submissionTypeOption: SubmissionTypeOption) => set({ submissionTypeOption }),
    setCustomization: (customization: CustomizationOptions) => set({ customization }),
    setAdvancedOptions: (advancedOptions: AdvancedOptions) => set({ advancedOptions }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setIsSuccess: (isSuccess: boolean) => set({ isSuccess }),
    setError: (step: number, error: ContestDeployError) => {
      let errorsCopy = [...get().errors];

      errorsCopy = errorsCopy.filter(error => error.step !== step);

      if (error.message) {
        errorsCopy.push(error);
      }

      set({ errors: errorsCopy });
    },
    setStep: (step: number) => set({ step }),
    setFurthestStep: (furthestStep: number) => set({ furthestStep }),
    setSubmissionTab: (submissionTab: number) => set({ submissionTab }),
    setVotingTab: (votingTab: number) => set({ votingTab }),
    setCharge: (charge: Charge) => set({ charge }),
    setMinCharge: (minCharge: { minCostToPropose: number; minCostToVote: number }) => set({ minCharge }),
    setPrevChainRefInCharge: (chain: string) => set({ prevChainRefInCharge: chain }),
    reset: () => set({ ...initialState }),
  };
});
