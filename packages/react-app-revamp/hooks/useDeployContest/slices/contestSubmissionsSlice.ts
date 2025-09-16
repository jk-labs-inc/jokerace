import { DEFAULT_ALLOWED_SUBMISSIONS_PER_USER, MAX_SUBMISSIONS_PER_CONTEST } from "../types";

export type CustomizationOptions = {
  allowedSubmissionsPerUser: number;
  maxSubmissions: number;
};

export interface SubmissionSliceState {
  customization: CustomizationOptions;
}

export interface SubmissionSliceActions {
  setCustomization: (customization: CustomizationOptions) => void;
}

export type SubmissionSlice = SubmissionSliceState & SubmissionSliceActions;

export const createSubmissionSlice = (set: any): SubmissionSlice => ({
  //TODO: move this to advanced options?
  customization: {
    allowedSubmissionsPerUser: DEFAULT_ALLOWED_SUBMISSIONS_PER_USER,
    maxSubmissions: MAX_SUBMISSIONS_PER_CONTEST,
  },

  setCustomization: (customization: CustomizationOptions) => set({ customization }),
});
