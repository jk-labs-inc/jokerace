import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const demoDayConfig: TemplateConfig = {
  type: TemplateType.demoDay,
  stepsToFulfill: [StepTitle.Title, StepTitle.Timing, StepTitle.Confirm],
  data: {
    prompt: {
      summarize:
        "In this demo day, anyone can vote on their favorite projects for 0.0001 eth per vote. Projects will be able to record their top supporters—so they can create and incentivize a community of voters at any time if they wish.",
      evaluateVoters:
        "Voters should evaluate builders’ projects based on their relevance, impact, originality, innovativeness, and success of what they’ve built.",
    },
    summary: "Upvote your favorite projects",
    type: "demo day",
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(1, "days").toDate(),
    votingClose: moment().add(1, "days").add(1, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
  },
};
