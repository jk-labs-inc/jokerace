import {
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "@components/_pages/Create/pages/ContestTiming/utils";
import { ContestType, ContestTypeConfig } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import {
  DEFAULT_ALLOWED_SUBMISSIONS_PER_USER,
  MAX_ALLOWED_SUBMISSIONS_PER_USER,
  MAX_SUBMISSIONS_PER_CONTEST,
} from "@hooks/useDeployContest/types";

export const emptyVotingRequirements = {
  type: "erc20",
  nftType: "erc721",
  chain: "mainnet",
  tokenAddress: "",
  minTokensRequired: 0.01,
  powerType: "token",
  powerValue: 100,
  timestamp: Date.now(),
  name: "",
  symbol: "",
  logo: "",
  nftTokenId: "",
};

const useSetContestTypeConfig = () => {
  const {
    contestType,
    setSubmissionOpen,
    setVotingOpen,
    setVotingClose,
    setVotingAllowlist,
    setVotingMerkle,
    setPriceCurve,
    setVotingRequirements,
    setVotingRequirementsOption,
    setSubmissionMerkle,
    setPrompt,
    setCustomization,
  } = useDeployContestStore(state => state);
  const { setTimingOption: setSubmissionTimingOption } = useTimingOptionForSubmissionPeriod(state => state);
  const { setTimingOption: setVotingTimingOption } = useTimingOptionForVotingPeriod(state => state);

  const setContestTypeConfig = (type: ContestType, config: ContestTypeConfig) => {
    if (type === contestType) {
      return;
    }

    if (type === ContestType.VotingContest) {
      setCustomization({
        maxSubmissions: MAX_SUBMISSIONS_PER_CONTEST,
        allowedSubmissionsPerUser: MAX_ALLOWED_SUBMISSIONS_PER_USER,
      });
    } else {
      setCustomization({
        maxSubmissions: MAX_SUBMISSIONS_PER_CONTEST,
        allowedSubmissionsPerUser: DEFAULT_ALLOWED_SUBMISSIONS_PER_USER,
      });
      setSubmissionMerkle(null);
    }

    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
    setSubmissionTimingOption(config.data.votingOpenPeriod);
    setVotingTimingOption(config.data.votingClosePeriod);
    setVotingAllowlist("csv", config.data.votingAllowlist.csv);
    setVotingAllowlist("prefilled", config.data.votingAllowlist.prefilled);
    setVotingMerkle("csv", config.data.votingMerkle.csv);
    setVotingMerkle("prefilled", config.data.votingMerkle.prefilled);
    setVotingRequirements(emptyVotingRequirements);
    setVotingRequirementsOption({
      value: "erc20",
      label: "token holders",
    });
    setPrompt({
      summarize: "",
      evaluateVoters: "Voters should evaluate based on 50% relevance to the prompt and 50% originality.",
      contactDetails: "Join the JokeRace telegram: https://t.co/j7Fp3u7pqS.",
    });
    setPriceCurve(config.data.priceCurve);
  };

  return setContestTypeConfig;
};

export default useSetContestTypeConfig;
