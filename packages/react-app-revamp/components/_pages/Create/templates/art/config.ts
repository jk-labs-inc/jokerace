import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const artConfig: TemplateConfig = {
  type: TemplateType.artContest,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Entries, StepTitle.Timing, StepTitle.Voting, StepTitle.Confirm],
  data: {
    prompt: {
      summarize:
        "In this art contest, anyone can submit their art, and a jury of voters from our team will vote on their favorite.",
      evaluateVoters: "Judges should evaluate art based on their originality, beauty, and use of the medium.",
    },
    entryPreviewConfig: {
      preview: EntryPreview.IMAGE,
      isAdditionalDescriptionEnabled: true,
    },
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
