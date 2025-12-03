import useContestVoteTimer, { VotingStatus } from "@components/_pages/Submission/hooks/useContestVoteTimer";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useShallow } from "zustand/shallow";
import NoVotesPlaceholderVotingClosed from "./components/NoVotesPlaceholderVotingClosed";
import NoVotesPlaceholderVotingOpen from "./components/NoVotesPlaceholderVotingOpen";

const NoVotersPlaceholder = () => {
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const { votingStatus } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });

  if (votingStatus === VotingStatus.VotingOpen) {
    return <NoVotesPlaceholderVotingOpen />;
  } else {
    return <NoVotesPlaceholderVotingClosed />;
  }
};

export default NoVotersPlaceholder;
