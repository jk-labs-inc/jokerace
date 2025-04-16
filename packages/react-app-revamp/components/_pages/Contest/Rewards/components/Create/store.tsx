import { create } from "zustand";

// https://github.com/pmndrs/zustand/discussions/821#discussioncomment-8548182
type ReactStyleStateSetter<T> = T | ((prev: T) => T);

interface ActionState {
  loading: boolean;
  error: boolean;
  success: boolean;
}

export enum CreationStep {
  FundPool,
  CreatePool,
  Review,
  DeploymentStatus,
}

export interface Recipient {
  id: number;
  place: number;
  proportion: number | null;
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
  addFundsToRewards?: boolean;
  addEarningsToRewards?: boolean;
  setStep: (step: CreationStep) => void;
  setRewardPoolData: (data: ReactStyleStateSetter<RewardPoolData>) => void;
  setAddFundsToRewards?: (addFundsToRewards: boolean) => void;
  setAddEarningsToRewards?: (addEarningsToRewards: boolean) => void;
}

const DEFAULT_RECIPIENTS: Recipient[] = [
  { id: 0, place: 1, proportion: 30 },
  { id: 1, place: 2, proportion: 25 },
  { id: 2, place: 3, proportion: 20 },
  { id: 3, place: 4, proportion: 15 },
  { id: 4, place: 5, proportion: 10 },
];

export const useCreateRewardsStore = create<CreateRewardsState>(set => ({
  currentStep: CreationStep.FundPool,
  rewardPoolData: {
    rankings: DEFAULT_RECIPIENTS.map(r => r.place),
    shareAllocations: DEFAULT_RECIPIENTS.map(r => r.proportion ?? 0),
    recipients: DEFAULT_RECIPIENTS,
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
  addFundsToRewards: false,
  setAddEarningsToRewards: addEarningsToRewards => set({ addEarningsToRewards }),
  setAddFundsToRewards: addFundsToRewards => set({ addFundsToRewards }),
  setRewardPoolData: data =>
    set(state => ({
      rewardPoolData: typeof data === "function" ? data(state.rewardPoolData) : data,
    })),
  setStep: step => set({ currentStep: step }),
}));
