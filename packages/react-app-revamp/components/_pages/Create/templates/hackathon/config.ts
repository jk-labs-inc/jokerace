import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const hackathonConfig: TemplateConfig = {
  type: TemplateType.hackathon,
  stepsToFulfill: [StepTitle.Title, StepTitle.Timing, StepTitle.Voting, StepTitle.Confirm],
  data: {
    prompt: {
      summarize:
        "In this hackathon, builders are invited to submit their project, and a jury of voters will vote on their favorite.",
      evaluateVoters:
        "Judges should evaluate builders’ projects based on their relevance, impact, originality, innovativeness, and success of what they’ve built.",
    },
    summary: "submit your project",
    type: "hackathon",
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(7, "days").toDate(),
    votingClose: moment().add(7, "days").add(1, "day").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.OneWeek,
      label: "one week",
    },
    votingClosePeriod: {
      value: TimingPeriod.OneDay,
      label: "one day",
    },
  },
};
