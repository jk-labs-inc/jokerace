import useContestVoteTimer, { VotingStatus } from "@components/_pages/Submission/hooks/useContestVoteTimer";
import useContestConfigStore from "@hooks/useContestConfig/store";
import Skeleton from "react-loading-skeleton";
import TimerDisplay from "./components/TimerDisplay";
import TimerLabel from "./components/TimerLabel";

const SubmissionPageDesktopVotingAreaTimer = () => {
  const { contestConfig } = useContestConfigStore(state => state);
  const { votingStatus, timeRemaining, isLoading } = useContestVoteTimer({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-6 pl-6 pr-8 py-4 rounded-3xl border border-381d4c bg-gradient-timer">
        <Skeleton width={120} height={20} baseColor="#6A6A6A" highlightColor="#BB65FF" />
        <Skeleton width={200} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />
      </div>
    );
  }

  // Don't show timer when voting is not open or closed
  if (votingStatus === VotingStatus.VotingNotOpen || votingStatus === VotingStatus.VotingClosed) {
    return null;
  }

  // Don't show timer if no time remaining data
  if (!timeRemaining) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-12 pl-6 pr-8 pt-2 pb-2 rounded-3xl border border-381d4c bg-gradient-timer">
      <TimerLabel label="voting ends" />
      <TimerDisplay timeRemaining={timeRemaining} />
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaTimer;
