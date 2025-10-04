import { create } from "zustand";
import { createProposalDataSlice, ProposalDataSlice } from "./slices/proposalDataSlice";
import { createContestDetailsSlice, ContestDetailsSlice } from "./slices/contestDetailsSlice";
import { createNavigationSlice, NavigationSlice } from "./slices/navigationSlice";
import { createTimingSlice, TimingSlice } from "./slices/timingSlice";

export type SubmissionPageStore = ProposalDataSlice &
  ContestDetailsSlice &
  NavigationSlice &
  TimingSlice & {
    resetStore: () => void;
  };

export const useSubmissionPageStore = create<SubmissionPageStore>(set => {
  const getInitialState = () => ({
    ...createProposalDataSlice(set),
    ...createContestDetailsSlice(set),
    ...createNavigationSlice(set),
    ...createTimingSlice(set),
  });

  const initialState = getInitialState();

  return {
    ...initialState,
    resetStore: () => {
      const freshState = getInitialState();
      set(freshState);
    },
  };
});
