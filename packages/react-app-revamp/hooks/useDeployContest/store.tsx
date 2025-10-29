import { create } from "zustand";
import { createContestInfoSlice, ContestInfoSlice } from "./slices/contestInfoSlice";
import { createContestTimingSlice, ContestTimingSlice } from "./slices/contestTimingSlice";
import { createSubmissionSlice, SubmissionSlice } from "./slices/contestSubmissionsSlice";
import { createMonetizationSlice, MonetizationSlice } from "./slices/contestMonetizationSlice";
import { createMetadataSlice, MetadataSlice } from "./slices/contestMetadataSlice";
import { createAdvancedOptionsSlice, AdvancedOptionsSlice } from "./slices/contestAdvancedOptionsSlice";
import { createDeploymentSlice, DeploymentSlice } from "./slices/contestDeploymentSlice";

export type DeployContestStore = ContestInfoSlice &
  ContestTimingSlice &
  SubmissionSlice &
  MonetizationSlice &
  MetadataSlice &
  AdvancedOptionsSlice &
  DeploymentSlice & {
    resetStore: () => void;
  };

export const useDeployContestStore = create<DeployContestStore>((set, get) => {
  const getInitialState = () => ({
    ...createContestInfoSlice(set),
    ...createContestTimingSlice(set, get),
    ...createSubmissionSlice(set),
    ...createMonetizationSlice(set),
    ...createMetadataSlice(set),
    ...createAdvancedOptionsSlice(set),
    ...createDeploymentSlice(set, get),
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
