import { PriceCurve } from "@hooks/useDeployContest/types";

export enum StepTitle {
  Type = "Type",
  Entries = "Entries",
  Timing = "Timing",
  Monetization = "Monetization",
  Rewards = "Rewards",
  Rules = "Rules",
  Confirm = "Confirm!",
}

export const getStepNumber = (stepTitle: StepTitle): number => {
  const stepMap: Record<StepTitle, number> = {
    [StepTitle.Type]: 0,
    [StepTitle.Monetization]: 1,
    [StepTitle.Timing]: 2,
    [StepTitle.Entries]: 3,
    [StepTitle.Rewards]: 4,
    [StepTitle.Rules]: 5,
    [StepTitle.Confirm]: 6,
  };
  return stepMap[stepTitle];
};

export enum ContestType {
  AnyoneCanPlay = "anyone can play",
  VotingContest = "voting contest",
}

export interface ContestDataForType {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  priceCurve: PriceCurve;
}

export interface ContestTypeConfig {
  data: ContestDataForType;
}
