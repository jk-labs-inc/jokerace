import { create } from "zustand";

// https://github.com/pmndrs/zustand/discussions/821#discussioncomment-8548182
type ReactStyleStateSetter<T> = T | ((prev: T) => T);

interface ActionState {
  loading: boolean;
  error: boolean;
  success: boolean;
}

export enum CreationStep {
  Initial = 0,
  CreatePool,
  FundPool,
  Review,
  DeploymentStatus,
}

export interface Recipient {
  id: number;
  place: number;
  proportion: number;
}

export interface ValidationError {
  uniqueRanks?: string;
  zeroProportion?: string;
  invalidTotal?: string;
  duplicateRank?: string;
}

export interface RewardPoolData {
  rankings: number[];
  shareAllocations: number[];
  recipients: Recipient[];
  validationError: ValidationError;
  deploy: ActionState;
  attach: ActionState;
  // this one is used for funding the pool state
  [key: string]: any;
}

interface CreateRewardsState {
  currentStep: CreationStep;
  rewardPoolData: RewardPoolData;
  addEarningsToRewards?: boolean;
  setStep: (step: CreationStep) => void;
  setRewardPoolData: (data: ReactStyleStateSetter<RewardPoolData>) => void;
  setAddEarningsToRewards?: (addEarningsToRewards: boolean) => void;
}

export const useCreateRewardsStore = create<CreateRewardsState>(set => ({
  currentStep: CreationStep.Initial,
  rewardPoolData: {
    rankings: [1],
    shareAllocations: [100],
    recipients: [{ id: 0, place: 1, proportion: 100 }],
    validationError: {
      uniqueRanks: undefined,
      zeroProportion: undefined,
      invalidTotal: undefined,
      duplicateRank: undefined,
    },
    deploy: {
      loading: false,
      error: false,
      success: false,
    },
    attach: {
      loading: false,
      error: false,
      success: false,
    },
  },
  addEarningsToRewards: false,
  setAddEarningsToRewards: addEarningsToRewards => set({ addEarningsToRewards }),
  setRewardPoolData: data =>
    set(state => ({
      rewardPoolData: typeof data === "function" ? data(state.rewardPoolData) : data,
    })),
  setStep: step => set({ currentStep: step }),
}));
