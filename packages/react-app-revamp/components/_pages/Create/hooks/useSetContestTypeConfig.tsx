import { ContestType, ContestTypeConfig } from "@components/_pages/Create/types";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import {
  DEFAULT_ALLOWED_SUBMISSIONS_PER_USER,
  MAX_ALLOWED_SUBMISSIONS_PER_USER,
  MAX_SUBMISSIONS_PER_CONTEST,
} from "@hooks/useDeployContest/types";

const useSetContestTypeConfig = () => {
  const { contestType, setSubmissionOpen, setVotingOpen, setVotingClose, setPriceCurve, setPrompt, setCustomization } =
    useDeployContestStore(state => state);

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
    }

    setSubmissionOpen(config.data.submissionOpen);
    setVotingOpen(config.data.votingOpen);
    setVotingClose(config.data.votingClose);
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
