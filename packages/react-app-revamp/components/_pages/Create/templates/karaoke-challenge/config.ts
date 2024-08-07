import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";

export const karaokeChallengeConfig: TemplateConfig = {
  type: TemplateType.karaokeChallenge,
  stepsToFulfill: [StepTitle.Title, StepTitle.Timing, StepTitle.Confirm],
  data: {
    prompt: {
      summarize:
        "It’s a Karaoke Challenge. Singers all need to submit their names, and then everyone can vote live on who they think gives the best performance",
      evaluateVoters:
        "Judges should evaluate singers based on their singing quality, star quality, and most importantly, their commitment to the bit.",
    },
    summary: "Pick the Karaoke Winner",
    type: "karaoke challenge",
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(15, "minutes").toDate(),
    votingClose: moment().add(15, "minutes").add(2, "hours").add(45, "minutes").toDate(),
    votingOpenPeriod: {
      value: TimingPeriod.Custom,
      label: "custom",
    },
    votingClosePeriod: {
      value: TimingPeriod.Custom,
      label: "custom",
    },
  },
};
