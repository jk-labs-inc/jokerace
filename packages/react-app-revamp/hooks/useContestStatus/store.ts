import { create } from "zustand";

export enum ContestStatus {
  ContestOpen = "ContestOpen",
  SubmissionOpen = "SubmissionOpen",
  VotingOpen = "VotingOpen",
  VotingClosed = "VotingClosed",
}

type Store = {
  contestStatus: ContestStatus;
  setContestStatus: (status: ContestStatus) => void;
};

export const useContestStatusStore = create<Store>(set => ({
  contestStatus: ContestStatus.ContestOpen,
  setContestStatus: (status: ContestStatus) => set(state => ({ ...state, contestStatus: status })),
}));
