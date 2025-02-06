import {
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestTypeConfig } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const useSetContestTypeConfig = () => {
  const { setPrompt, setSubmissionOpen, setVotingOpen, setVotingClose, setVotingAllowlist, setVotingMerkle } =
    useDeployContestStore(state => state);
  const { setTimingOption: setSubmissionTimingOption } = useTimingOptionForSubmissionPeriod(state => state);

  const { setTimingOption: setVotingTimingOption } = useTimingOptionForVotingPeriod(state => state);

  const setContestTypeConfig = (config: ContestTypeConfig) => {
    setPrompt(config.data.prompt);
    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
    setSubmissionTimingOption(config.data.votingOpenPeriod);
    setVotingTimingOption(config.data.votingClosePeriod);
    setVotingAllowlist("csv", config.data.votingAllowlist.csv);
    setVotingAllowlist("prefilled", config.data.votingAllowlist.prefilled);
    setVotingMerkle("csv", config.data.votingMerkle.csv);
    setVotingMerkle("prefilled", config.data.votingMerkle.prefilled);
  };

  return setContestTypeConfig;
};

export default useSetContestTypeConfig;
