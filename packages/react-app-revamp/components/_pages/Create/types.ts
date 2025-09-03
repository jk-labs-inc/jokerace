import { PriceCurve, VotingMerkle } from "@hooks/useDeployContest/types";
import { Option } from "./components/DefaultDropdown";

export enum StepTitle {
  Type = "Type",
  Entries = "Entries",
  Timing = "Timing",
  Monetization = "Monetization",
  Rules = "Rules",
  Confirm = "Confirm!",
}

export enum ContestType {
  AnyoneCanPlay = "anyone can play",
  VotingContest = "voting contest",
}

export interface ContestDataForType {
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingOpenPeriod: Option;
  votingClosePeriod: Option;
  priceCurve: PriceCurve;
}

export interface ContestTypeConfig {
  data: ContestDataForType;
}
