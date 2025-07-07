import { SubmissionMerkle, DEFAULT_ALLOWED_SUBMISSIONS_PER_USER, MAX_SUBMISSIONS_PER_CONTEST } from "../types";

export type CustomizationOptions = {
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
};

export interface SubmissionSliceState {
  submissionMerkle: SubmissionMerkle | null;
  customization: CustomizationOptions;
}

export interface SubmissionSliceActions {
  setSubmissionMerkle: (submissionMerkle: SubmissionMerkle | null) => void;
  setCustomization: (customization: CustomizationOptions) => void;
}

export type SubmissionSlice = SubmissionSliceState & SubmissionSliceActions;

export const createSubmissionSlice = (set: any): SubmissionSlice => ({
  submissionMerkle: null,
  //TODO: move this to advanced options?
  customization: {
    allowedSubmissionsPerUser: DEFAULT_ALLOWED_SUBMISSIONS_PER_USER,
    maxSubmissions: MAX_SUBMISSIONS_PER_CONTEST,
  },

  setSubmissionMerkle: (submissionMerkle: SubmissionMerkle | null) => set({ submissionMerkle }),
  setCustomization: (customization: CustomizationOptions) => set({ customization }),
});
