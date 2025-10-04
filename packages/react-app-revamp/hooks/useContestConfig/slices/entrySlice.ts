export interface EntrySliceState {
  proposalId: string;
}

export interface EntrySliceActions {
  setProposalId: (proposalId: string) => void;
}

export type EntrySlice = EntrySliceState & EntrySliceActions;

export const createEntrySlice = (set: any): EntrySlice => ({
  proposalId: "",

  setProposalId: (proposalId: string) => set({ proposalId }),
});
