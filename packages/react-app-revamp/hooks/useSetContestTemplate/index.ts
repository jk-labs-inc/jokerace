import {
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "@components/_pages/Create/pages/ContestTiming/utils";
import { TemplateConfig } from "@components/_pages/Create/templates/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { ContestType } from "@components/_pages/Create/types";
import { useSubmissionMerkle } from "@components/_pages/Create/hooks/useSubmissionMerkle";
import { useAccount } from "wagmi";
const useSetContestTemplate = () => {
  const { address } = useAccount();
  const {
    setContestType,
    setPrompt,
    setTitle,
    setSubmissionOpen,
    setVotingOpen,
    setSubmissionMerkle,
    setVotingClose,
    setEntryPreviewConfig,
  } = useDeployContestStore(state => state);
  const { setTimingOption: setSubmissionTimingOption } = useTimingOptionForSubmissionPeriod(state => state);
  const { setTimingOption: setVotingTimingOption } = useTimingOptionForVotingPeriod(state => state);
  const { processCreatorAllowlist } = useSubmissionMerkle();

  const setContestTemplateConfig = (config: TemplateConfig) => {
    if (config.data.contestType === ContestType.VotingContest) {
      processCreatorAllowlist(address);
    } else {
      setSubmissionMerkle(null);
    }

    setContestType(config.data.contestType);
    setTitle(config.data.rules.title);
    setPrompt(config.data.rules.prompt);
    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
    setSubmissionTimingOption(config.data.votingOpenPeriod);
    setVotingTimingOption(config.data.votingClosePeriod);
    setEntryPreviewConfig(config.data.entryPreviewConfig);
  };

  return setContestTemplateConfig;
};

export default useSetContestTemplate;
