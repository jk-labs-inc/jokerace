import { ProposalStaticData } from "lib/submission";

export interface ProposalDataSliceState {
  proposalStaticData: ProposalStaticData | null;
}

export interface ProposalDataSliceActions {
  setProposalStaticData: (data: ProposalStaticData | null) => void;
}

export type ProposalDataSlice = ProposalDataSliceState & ProposalDataSliceActions;

export const createProposalDataSlice = (set: any): ProposalDataSlice => ({
  proposalStaticData: null,

  setProposalStaticData: (data: ProposalStaticData | null) => set({ proposalStaticData: data }),
});
