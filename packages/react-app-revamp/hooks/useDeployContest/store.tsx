import { EMPTY_FIELDS_SUBMISSION, EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { SubmissionFieldObject } from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor";
import { VotingFieldObject } from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { create } from "zustand";

type CustomError = {
  step: number;
  message: string;
};

export type VotingMerkle = {
  merkleRoot: string;
  voters: Recipient[];
};

export type SubmissionMerkle = {
  merkleRoot: string;
  submitters: Recipient[];
};

export interface DeployContestState {
  deployContestData: {
    chain: string;
    chainId: number;
    hash: string;
    address: string;
  };
  type: string;
  title: string;
  summary: string;
  prompt: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingRequirements: string;
  submissionRequirements: string;
  votingAllowlistFields: VotingFieldObject[];
  votingMerkle: VotingMerkle | null;
  submissionAllowlistFields: SubmissionFieldObject[];
  submissionMerkle: SubmissionMerkle | null;
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
  downvote: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  errors: CustomError[];
  step: number;
  furthestStep: number;
  submissionTab: number;

  setDeployContestData: (chain: string, chainId: number, hash: string, address: string) => void;
  setType: (type: string) => void;
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
  setPrompt: (prompt: string) => void;
  setSubmissionOpen: (submissionOpen: Date) => void;
  setVotingOpen: (votingOpen: Date) => void;
  setVotingClose: (votingClose: Date) => void;
  setVotingRequirements: (votingRequirements: string) => void;
  setSubmissionRequirements: (submissionRequirements: string) => void;
  setVotingAllowlistFields: (votingAllowlistFields: VotingFieldObject[]) => void;
  setVotingMerkle: (votingInfo: VotingMerkle | null) => void;
  setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) => void;
  setSubmissionMerkle: (submissionInfo: SubmissionMerkle | null) => void;
  setAllowedSubmissionsPerUser: (allowedSubmissionsPerUser: number) => void;
  setMaxSubmissions: (maxSubmissions: number) => void;
  setDownvote: (downvote: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (step: number, error: CustomError) => void;
  setStep: (step: number) => void;
  setFurthestStep: (furthestStep: number) => void;
  setSubmissionTab: (tab: number) => void;
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
    },
    type: "",
    title: "",
    summary: "",
    prompt: "",
    submissionOpen: initialSubmissionOpen,
    votingOpen: initialVotingOpen,
    votingClose: initialVotingClose,
    votingRequirements: "",
    submissionRequirements: "anyone",
    votingAllowlistFields: Array(15).fill(EMPTY_FIELDS_VOTING),
    votingMerkle: null,
    submissionAllowlistFields: Array(15).fill(EMPTY_FIELDS_SUBMISSION),
    submissionMerkle: null,
    allowedSubmissionsPerUser: 0,
    maxSubmissions: 200,
    downvote: true,
    isLoading: false,
    isSuccess: false,
    errors: [],
    step: 0,
    furthestStep: 0,
    submissionTab: 0,
  };

  return {
    ...initialState,

    setDeployContestData: (chain: string, chainId: number, hash: string, address: string) =>
      set({ deployContestData: { chain, chainId, hash, address } }),
    setType: (type: string) => set({ type }),
    setTitle: (title: string) => set({ title }),
    setSummary: (summary: string) => set({ summary }),
    setPrompt: (prompt: string) => set({ prompt }),
    setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
    setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
    setVotingClose: (votingClose: Date) => set({ votingClose }),
    setVotingRequirements: (votingRequirements: string) => set({ votingRequirements }),
    setSubmissionRequirements: (submissionRequirements: string) => set({ submissionRequirements }),
    setVotingAllowlistFields: (votingAllowlistFields: VotingFieldObject[]) => set({ votingAllowlistFields }),
    setVotingMerkle: (votingMerkle: VotingMerkle | null) => set({ votingMerkle }),
    setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) =>
      set({ submissionAllowlistFields }),
    setSubmissionMerkle: (submissionMerkle: SubmissionMerkle | null) => set({ submissionMerkle }),
    setAllowedSubmissionsPerUser: (allowedSubmissionsPerUser: number) => set({ allowedSubmissionsPerUser }),
    setMaxSubmissions: (maxSubmissions: number) => set({ maxSubmissions }),
    setDownvote: (downvote: boolean) => set({ downvote }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setIsSuccess: (isSuccess: boolean) => set({ isSuccess }),
    setError: (step: number, error: CustomError) => {
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

    reset: () => set({ ...initialState }),
  };
});
