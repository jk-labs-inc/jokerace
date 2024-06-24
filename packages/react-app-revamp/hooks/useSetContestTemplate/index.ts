import {
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "@components/_pages/Create/pages/ContestTiming/utils";
import { TemplateConfig } from "@components/_pages/Create/templates/types";
import { StepTitle } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const checkIfSubmissionOrVotingNeeded = (
  steps: StepTitle[],
): { isSubmissionNeeded: boolean; isVotingNeeded: boolean } => {
  return {
    isSubmissionNeeded: steps.includes(StepTitle.Submissions),
    isVotingNeeded: steps.includes(StepTitle.Voting),
  };
};

const useSetContestTemplate = () => {
  const {
    setPrompt,
    setSummary,
    setType,
    setSubmissionOpen,
    setVotingOpen,
    setVotingClose,
    setVotingTab,
    setSubmissionTab,
  } = useDeployContestStore(state => state);
  const { setTimingOption: setSubmissionTimingOption } = useTimingOptionForSubmissionPeriod(state => state);
  const { setTimingOption: setVotingTimingOption } = useTimingOptionForVotingPeriod(state => state);

  const setContestTemplateConfig = (config: TemplateConfig) => {
    const { isSubmissionNeeded, isVotingNeeded } = checkIfSubmissionOrVotingNeeded(config.stepsToFulfill);

    setPrompt(config.data.prompt);
    setSummary(config.data.summary);
    setType(config.data.type);
    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
    setSubmissionTab(isSubmissionNeeded ? 2 : 0);
    setVotingTab(isVotingNeeded ? 2 : 0);
    setSubmissionTimingOption(config.data.votingOpenPeriod);
    setVotingTimingOption(config.data.votingClosePeriod);
  };

  return setContestTemplateConfig;
};

export default useSetContestTemplate;
