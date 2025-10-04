export interface ContestDetailsSliceState {
  contestDetails: {
    author: string | null;
    name: string | null;
  };
}

export interface ContestDetailsSliceActions {
  setContestDetails: (details: { author: string | null; name: string | null }) => void;
}

export type ContestDetailsSlice = ContestDetailsSliceState & ContestDetailsSliceActions;

export const createContestDetailsSlice = (set: any): ContestDetailsSlice => ({
  contestDetails: {
    author: null,
    name: null,
  },

  setContestDetails: (details: { author: string | null; name: string | null }) => set({ contestDetails: details }),
});
