import { PriceCurve } from "@hooks/useDeployContest/types";

export enum StepTitle {
  Entries = "Entries",
  Voting = "Voting",
  Timing = "Timing",
  Rewards = "Rewards",
  Rules = "Rules",
  Confirm = "Confirm!",
}

export const getStepNumber = (stepTitle: StepTitle): number => {
  const stepMap: Record<StepTitle, number> = {
    [StepTitle.Entries]: 0,
    [StepTitle.Voting]: 1,
    [StepTitle.Timing]: 2,
    [StepTitle.Rewards]: 3,
    [StepTitle.Rules]: 4,
    [StepTitle.Confirm]: 5,
  };
  return stepMap[stepTitle];
};

export interface ContestDataForType {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  priceCurve: PriceCurve;
}

export interface ContestTypeConfig {
  data: ContestDataForType;
}
