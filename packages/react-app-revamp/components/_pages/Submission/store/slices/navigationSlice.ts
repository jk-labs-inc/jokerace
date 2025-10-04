export interface NavigationSliceState {
  allProposalIds: string[];
}

export interface NavigationSliceActions {
  setAllProposalIds: (ids: string[]) => void;
}

export type NavigationSlice = NavigationSliceState & NavigationSliceActions;

export const createNavigationSlice = (set: any): NavigationSlice => ({
  allProposalIds: [],

  setAllProposalIds: (ids: string[]) => set({ allProposalIds: ids }),
});
