import { EMPTY_FIELDS_SUBMISSION, EMPTY_FIELDS_VOTING } from "@components/_pages/Create/constants/csv";
import { SubmissionFieldObject } from "@components/_pages/Create/pages/ContestSubmission/components/SubmissionAllowlist/components/CSVEditor";
import { VotingFieldObject } from "@components/_pages/Create/pages/ContestVoting/components/VotingAllowlist/components/CSVEditor";
import { MerkleTreeSubmissionsData } from "lib/merkletree/generateSubmissionsTree";
import { MerkleTreeVotingData } from "lib/merkletree/generateVotersTree";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

type CustomError = {
  step: number;
  message: string;
};

type PageAction = "create" | "play";

export interface DeployContestState {
  pageAction: PageAction;
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
  votingMerkle: MerkleTreeVotingData | null;
  submissionAllowlistFields: SubmissionFieldObject[];
  submissionMerkle: MerkleTreeSubmissionsData | null;
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
  downvote: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  errors: CustomError[];
  step: number;
  furthestStep: number;
  submissionTab: number;

  setPageAction: (pageAction: PageAction) => void;
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
  setVotingMerkle: (votingInfo: MerkleTreeVotingData | null) => void;
  setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) => void;
  setSubmissionMerkle: (submissionInfo: MerkleTreeSubmissionsData | null) => void;
  setAllowedSubmissionsPerUser: (allowedSubmissionsPerUser: number) => void;
  setMaxSubmissions: (maxSubmissions: number) => void;
  setDownvote: (downvote: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (step: number, error: CustomError) => void;
  setStep: (step: number) => void;
  setFurthestStep: (furthestStep: number) => void;
  setSubmissionTab: (tab: number) => void;
}

export const createDeployContestStore = () =>
  createStore<DeployContestState>((set, get) => {
    const submissionOpen: Date = new Date();

    const votingOpen: Date = new Date();
    votingOpen.setDate(votingOpen.getDate() + 7);

    const votingClose: Date = new Date();
    votingClose.setDate(votingClose.getDate() + 14);

    return {
      pageAction: "create",
      type: "",
      title: "",
      summary: "",
      prompt: "",
      submissionOpen: submissionOpen,
      votingOpen: votingOpen,
      votingClose: votingClose,
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

      setPageAction: (pageAction: PageAction) => set({ pageAction }),
      setType: (type: string) => set({ type }),
      setTitle: (title: string) => set({ title }),
      setSummary: (summary: string) => set({ summary }),
      setPrompt: (prompt: string) => set({ prompt }),
      setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
      setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
      setVotingClose: (votingClose: Date) => set({ votingClose }),
      setVotingRequirements: (votingRequirements: string) => set({ votingRequirements }),
      setVotingAllowlistFields: (votingAllowlistFields: VotingFieldObject[]) => set({ votingAllowlistFields }),
      setVotingMerkle: (votingMerkle: MerkleTreeVotingData | null) => set({ votingMerkle }),
      setSubmissionRequirements: (submissionRequirements: string) => set({ submissionRequirements }),
      setSubmissionAllowlistFields: (submissionAllowlistFields: SubmissionFieldObject[]) =>
        set({ submissionAllowlistFields }),
      setSubmissionMerkle: (submissionMerkle: MerkleTreeSubmissionsData | null) => set({ submissionMerkle }),
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
    };
  });

export const DeployContestContext = createContext<ReturnType<typeof createDeployContestStore> | null>(null);

export function DeployContestWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createDeployContestStore>>();
  if (!storeRef.current) {
    storeRef.current = createDeployContestStore();
  }
  return <DeployContestContext.Provider value={storeRef.current}>{children}</DeployContestContext.Provider>;
}

export function useDeployContestStore<T>(selector: (state: DeployContestState) => T) {
  const store = useContext(DeployContestContext);
  if (store === null) {
    throw new Error("Missing DeployContestWrapper in the tree");
  }
  const value = useStore(store, selector);
  return value;
}
