import { create } from "zustand";

export enum CreationStep {
  Initial = 0,
  CreatePool,
  FundPool,
  Review,
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

interface ActionState {
  loading: boolean;
  error: boolean;
  success: boolean;
}

interface RewardPoolData {
  rankings: number[];
  shareAllocations: number[];
  recipients: Recipient[];
  validationError: ValidationError;
  deploy: ActionState;
  attach: ActionState;
}

interface CreateRewardsState {
  currentStep: CreationStep;
  rewardPoolData: RewardPoolData;
  setStep: (step: CreationStep) => void;
  setRewardPoolData: (data: RewardPoolData) => void;
}

export const useCreateRewardsStore = create<CreateRewardsState>(set => ({
  currentStep: CreationStep.Initial,
  rewardPoolData: {
    rankings: [],
    shareAllocations: [],
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
  setRewardPoolData: data => set({ rewardPoolData: data }),
  setStep: step => set({ currentStep: step }),
}));
