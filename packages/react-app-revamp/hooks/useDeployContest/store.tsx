import { MerkleTreeData } from "lib/merkletree/generate";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

type CustomError = {
  step: number;
  message: string;
};

export interface DeployContestState {
  type: string;
  title: string;
  summary: string;
  prompt: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingInfo: MerkleTreeData | null;
  submissionInfo: MerkleTreeData | null;
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
  downvote: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  errors: CustomError[];
  step: number;
  furthestStep: number;

  setType: (type: string) => void;
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
  setPrompt: (prompt: string) => void;
  setSubmissionOpen: (submissionOpen: Date) => void;
  setVotingOpen: (votingOpen: Date) => void;
  setVotingClose: (votingClose: Date) => void;
  setVotingInfo: (votingInfo: MerkleTreeData) => void;
  setSubmissionInfo: (submissionInfo: MerkleTreeData) => void;
  setAllowedSubmissionsPerUser: (allowedSubmissionsPerUser: number) => void;
  setMaxSubmissions: (maxSubmissions: number) => void;
  setDownvote: (downvote: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (step: number, error: CustomError) => void;
  setStep: (step: number) => void;
  setFurthestStep: (furthestStep: number) => void;
}

export const createDeployContestStore = () =>
  createStore<DeployContestState>((set, get) => {
    const submissionOpen: Date = new Date();

    const votingOpen: Date = new Date();
    votingOpen.setDate(votingOpen.getDate() + 7);

    const votingClose: Date = new Date();
    votingClose.setDate(votingClose.getDate() + 14);

    return {
      type: "",
      title: "",
      summary: "",
      prompt: "",
      submissionOpen: submissionOpen,
      votingOpen: votingOpen,
      votingClose: votingClose,
      votingInfo: null,
      submissionInfo: null,
      allowedSubmissionsPerUser: 0,
      maxSubmissions: 0,
      downvote: false,
      isLoading: false,
      isSuccess: false,
      errors: [],
      step: 0,
      furthestStep: 0,

      setType: (type: string) => set({ type }),
      setTitle: (title: string) => set({ title }),
      setSummary: (summary: string) => set({ summary }),
      setPrompt: (prompt: string) => set({ prompt }),
      setSubmissionOpen: (submissionOpen: Date) => set({ submissionOpen }),
      setVotingOpen: (votingOpen: Date) => set({ votingOpen }),
      setVotingClose: (votingClose: Date) => set({ votingClose }),
      setVotingInfo: (votingInfo: MerkleTreeData) => set({ votingInfo }),
      setSubmissionInfo: (submissionInfo: MerkleTreeData) => set({ submissionInfo }),
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
