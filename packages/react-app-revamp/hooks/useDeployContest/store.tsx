import { EMPTY_FIELDS_SUBMISSION, EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { SubmissionFieldObject } from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor";
import { VotingFieldObject } from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor";
import { create } from "zustand";
import { SubmissionMerkle, SubmissionRequirements, VotingMerkle, VotingRequirements } from "./types";

type ContestDeployError = {
  step: number;
  message: string;
};

export interface DeployContestState {
  deployContestData: {
    chain: string;
    chainId: number;
    hash: string;
    address: string;
    maxSubmissions: number;
  };
  type: string;
  title: string;
  summary: string;
  prompt: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingRequirements: VotingRequirements;
  submissionRequirementsOption: string;
  votingAllowlist: {
    manual: Record<string, number>;
    prefilled: Record<string, number>;
  };
  votingMerkle: {
    manual: VotingMerkle | null;
    prefilled: VotingMerkle | null;
  };
  votingAllowlistFields: VotingFieldObject[];
  submissionAllowlist: {
    manual: Record<string, number>;
    prefilled: Record<string, number>;
  };
  submissionAllowlistFields: SubmissionFieldObject[];
  submissionMerkle: {
    manual: SubmissionMerkle | null;
    prefilled: SubmissionMerkle | null;
  };
  submissionRequirements: SubmissionRequirements;
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
  downvote: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  errors: ContestDeployError[];
  step: number;
  furthestStep: number;
  submissionTab: number;
  votingTab: number;
  setDeployContestData: (chain: string, chainId: number, hash: string, address: string, maxSubmissions: number) => void;
  setType: (type: string) => void;
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
  setPrompt: (prompt: string) => void;
  setSubmissionOpen: (submissionOpen: Date) => void;
  setVotingOpen: (votingOpen: Date) => void;
  setVotingClose: (votingClose: Date) => void;
  setVotingRequirements: (votingRequirements: VotingRequirements) => void;
  setSubmissionRequirementsOption: (submissionRequirementsOption: string) => void;
  setVotingAllowlist: (type: "manual" | "prefilled", votingAllowlist: Record<string, number>) => void;
  setVotingMerkle: (type: "manual" | "prefilled", votingMerkle: VotingMerkle | null) => void;
  setVotingAllowlistFields: (votingAllowlistFields: VotingFieldObject[]) => void;
  setSubmissionAllowlist: (type: "manual" | "prefilled", submissionAllowlist: Record<string, number>) => void;
  setSubmissionMerkle: (type: "manual" | "prefilled", submissionMerkle: SubmissionMerkle | null) => void;
  setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) => void;
  setSubmissionRequirements: (submissionRequirements: SubmissionRequirements) => void;
  setAllowedSubmissionsPerUser: (allowedSubmissionsPerUser: number) => void;
  setMaxSubmissions: (maxSubmissions: number) => void;
  setDownvote: (downvote: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (step: number, error: ContestDeployError) => void;
  setStep: (step: number) => void;
  setFurthestStep: (furthestStep: number) => void;
  setSubmissionTab: (tab: number) => void;
  setVotingTab: (tab: number) => void;
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
      maxSubmissions: 0,
    },
    type: "",
    title: "",
    summary: "",
    prompt: "",
    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,
    submissionRequirementsOption: "anyone",
    votingAllowlist: {
      manual: {},
      prefilled: {},
    },
    votingAllowlistFields: Array(15).fill(EMPTY_FIELDS_VOTING),
    votingMerkle: {
      manual: null,
      prefilled: null,
    },
    votingRequirements: {
      type: "erc721",
      chain: "mainnet",
      tokenAddress: "",
      minTokensRequired: 1,
      powerType: "token",
      powerValue: 100,
      timestamp: Date.now(),
    },
    submissionAllowlist: {
      manual: {},
      prefilled: {},
    },
    submissionAllowlistFields: Array(15).fill(EMPTY_FIELDS_SUBMISSION),
    submissionMerkle: {
      manual: null,
      prefilled: null,
    },
    submissionRequirements: {
      type: "erc721",
      chain: "mainnet",
      tokenAddress: "",
      minTokensRequired: 1,
      timestamp: Date.now(),
    },
    allowedSubmissionsPerUser: 0,
    maxSubmissions: 100,
    downvote: true,
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

    setDeployContestData: (chain: string, chainId: number, hash: string, address: string, maxSubmissions: number) =>
      set({ deployContestData: { chain, chainId, hash, address, maxSubmissions } }),
    setType: (type: string) => set({ type }),
    setTitle: (title: string) => set({ title }),
    setSummary: (summary: string) => set({ summary }),
    setPrompt: (prompt: string) => set({ prompt }),
    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
    setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
    setVotingClose: (votingClose: Date) => set({ votingClose }),
    setSubmissionRequirementsOption: (submissionRequirementsOption: string) => set({ submissionRequirementsOption }),
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
    setAllowedSubmissionsPerUser: (allowedSubmissionsPerUser: number) => set({ allowedSubmissionsPerUser }),
    setMaxSubmissions: (maxSubmissions: number) => set({ maxSubmissions }),
    setDownvote: (downvote: boolean) => set({ downvote }),
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
    reset: () => set({ ...initialState }),
  };
});
