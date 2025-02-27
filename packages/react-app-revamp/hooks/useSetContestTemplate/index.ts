import {
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "@components/_pages/Create/pages/ContestTiming/utils";
import { TemplateConfig } from "@components/_pages/Create/templates/types";
import { StepTitle } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const checkIfVotingNeeded = (steps: StepTitle[]): { isVotingNeeded: boolean } => {
  return {
    isVotingNeeded: steps.includes(StepTitle.Voting),
  };
};

const useSetContestTemplate = () => {
  const {
    setContestType,
    setPrompt,
    setTitle,
    setSubmissionOpen,
    setVotingOpen,
    setVotingClose,
    setVotingTab,
    setEntryPreviewConfig,
  } = useDeployContestStore(state => state);
  const { setTimingOption: setSubmissionTimingOption } = useTimingOptionForSubmissionPeriod(state => state);
  const { setTimingOption: setVotingTimingOption } = useTimingOptionForVotingPeriod(state => state);

  const setContestTemplateConfig = (config: TemplateConfig) => {
    const { isVotingNeeded } = checkIfVotingNeeded(config.stepsToFulfill);

    setContestType(config.data.contestType);
    setTitle(config.data.rules.title);
    setPrompt(config.data.rules.prompt);
    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
    setVotingTab(isVotingNeeded ? 1 : 0);
    setSubmissionTimingOption(config.data.votingOpenPeriod);
    setVotingTimingOption(config.data.votingClosePeriod);
    setEntryPreviewConfig(config.data.entryPreviewConfig);
  };

  return setContestTemplateConfig;
};

export default useSetContestTemplate;
