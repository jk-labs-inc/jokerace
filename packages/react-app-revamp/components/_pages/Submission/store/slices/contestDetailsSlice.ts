import { ContestStateEnum } from "@hooks/useContestState/store";

export interface ContestDetailsSliceState {
  contestDetails: {
    author: string | null;
    name: string | null;
    state: ContestStateEnum | null;
  };
}

export interface ContestDetailsSliceActions {
  setContestDetails: (details: { author: string | null; name: string | null; state: ContestStateEnum | null }) => void;
}

export type ContestDetailsSlice = ContestDetailsSliceState & ContestDetailsSliceActions;

export const createContestDetailsSlice = (set: any): ContestDetailsSlice => ({
  contestDetails: {
    author: null,
    name: null,
    state: null,
  },

  setContestDetails: (details: { author: string | null; name: string | null; state: ContestStateEnum | null }) =>
    set({ contestDetails: details }),
});
