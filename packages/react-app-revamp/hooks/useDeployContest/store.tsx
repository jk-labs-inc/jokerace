import { create } from "zustand";
import { createContestInfoSlice, ContestInfoSlice } from "./slices/contestInfoSlice";
import { createContestTimingSlice, ContestTimingSlice } from "./slices/contestTimingSlice";
import { createSubmissionSlice, SubmissionSlice } from "./slices/contestSubmissionsSlice";
import { createMonetizationSlice, MonetizationSlice } from "./slices/contestMonetizationSlice";
import { createMetadataSlice, MetadataSlice } from "./slices/contestMetadataSlice";
import { createAdvancedOptionsSlice, AdvancedOptionsSlice } from "./slices/contestAdvancedOptionsSlice";
import { createDeploymentSlice, DeploymentSlice } from "./slices/contestDeploymentSlice";
import { createCreateRewardsSlice, CreateRewardsSlice } from "./slices/contestCreateRewards";
import { createDeploymentProcessSlice, DeploymentProcessSlice } from "./slices/contestDeploymentProcessSlice";

export type DeployContestStore = ContestInfoSlice &
  ContestTimingSlice &
  SubmissionSlice &
  MonetizationSlice &
  MetadataSlice &
  AdvancedOptionsSlice &
  CreateRewardsSlice &
  DeploymentSlice &
  DeploymentProcessSlice & {
    resetStore: () => void;
  };

export const useDeployContestStore = create<DeployContestStore>((set, get, store) => ({
  ...createContestInfoSlice(set),
  ...createContestTimingSlice(set, get),
  ...createSubmissionSlice(set),
  ...createMonetizationSlice(set),
  ...createMetadataSlice(set),
  ...createAdvancedOptionsSlice(set),
  ...createCreateRewardsSlice(set, get),
  ...createDeploymentSlice(set, get),
  ...createDeploymentProcessSlice(set, get),
  resetStore: () => {
    set(store.getInitialState());
  },
}));
