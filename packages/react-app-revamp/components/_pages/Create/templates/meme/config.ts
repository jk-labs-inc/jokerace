import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const memeConfig: TemplateConfig = {
  type: TemplateType.memeContest,
  stepsToFulfill: [StepTitle.Title, StepTitle.Timing, StepTitle.Voting, StepTitle.Confirm],
  data: {
    prompt: {
      summarize:
        "In this meme contest, anyone can submit a meme, and a jury of voters from our team will vote on their favorite.",
      evaluateVoters:
        "Judges should evaluate memes based on their relevance, impact, originality, and—obviously—their humor.",
    },
    summary: "submit your meme",
    type: "meme contest",
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
