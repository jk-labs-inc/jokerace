import moment from "moment";
import { TimingPeriod } from "../../pages/ContestTiming/utils";
import { ContestType, StepTitle } from "../../types";
import { TemplateConfig, TemplateType } from "../types";
import { EntryPreview } from "@hooks/useDeployContest/store";

export const debateConfig: TemplateConfig = {
  type: TemplateType.debate,
  stepsToFulfill: [StepTitle.Rules, StepTitle.Confirm],
  data: {
    contestType: ContestType.VotingContest,
    rules: {
      title: "Official Debate!",
      prompt: {
        summarize: "Pick whoever you think won this debate or feud.",
        evaluateVoters:
          "Voters should evaluate contestants equally based on the merits of their case as well as their delivery.",
        contactDetails: "Join the JokeRace telegram: https://t.me/+rW5X0MqnTXBkOGIx",
      },
    },
    entryPreviewConfig: {
      preview: EntryPreview.IMAGE_AND_TITLE,
      isAdditionalDescriptionEnabled: true,
    },
    submissionOpen: moment().toDate(),
    votingOpen: moment().add(30, "minutes").toDate(),
    votingClose: moment().add(30, "minutes").add(47.5, "hours").toDate(),
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
