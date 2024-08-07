import { Prompt } from "@hooks/useDeployContest/store";
import { Option } from "../components/DefaultDropdown";
import { StepTitle } from "../types";

export enum TemplateType {
  hackathon = "hackathon",
  demoDay = "demo day",
  debate = "debate",
  grantsRound = "grants round",
  memeContest = "meme contest",
  artContest = "art contest",
  karaokeChallenge = "karaoke challenge",
}

interface ContestData {
  prompt: Prompt;
  summary: string;
  type: string;
  submissionOpen: Date;
  votingOpen: Date;
  votingClose: Date;
  votingOpenPeriod: Option;
  votingClosePeriod: Option;
}

export interface TemplateConfig {
  type: TemplateType;
  stepsToFulfill: StepTitle[];
  data: ContestData;
}
