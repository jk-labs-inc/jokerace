import { ContestVoteTimings } from "@components/_pages/Submission/types";

export interface TimingSliceState {
  voteTimings: ContestVoteTimings | null;
}

export interface TimingSliceActions {
  setVoteTimings: (timings: ContestVoteTimings | null) => void;
}

export type TimingSlice = TimingSliceState & TimingSliceActions;

export const createTimingSlice = (set: any): TimingSlice => ({
  voteTimings: null,

  setVoteTimings: (timings: ContestVoteTimings | null) => set({ voteTimings: timings }),
});
