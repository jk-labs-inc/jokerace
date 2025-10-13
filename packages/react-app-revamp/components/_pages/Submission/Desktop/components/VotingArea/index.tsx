import useContestVoteTimer, { VotingStatus } from "@components/_pages/Submission/hooks/useContestVoteTimer";
import useProposalIdStore from "@hooks/useProposalId/store";
import SubmissionPageDesktopVotingAreaWidget from "./components/Widget";
import SubmissionPageDesktopVotingAreaWidgetVoters from "./components/Widget/components/Voters";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import SubmissionPageDesktopVotingAreaWidgetVotingNotOpen from "./components/Placeholder/components/VotingNotOpen";
import { useShallow } from "zustand/shallow";

const SubmissionPageDesktopVotingArea = () => {
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const { votingStatus, isVotingOpen, timeRemaining } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });

  return (
    <div className="flex flex-col p-4 gap-4 bg-primary-1 rounded-4xl xl:w-[480px] h-full">
      {votingStatus === VotingStatus.VotingNotOpen && (
        <SubmissionPageDesktopVotingAreaWidgetVotingNotOpen timeRemaining={timeRemaining} />
      )}
      {votingStatus === VotingStatus.VotingOpen && <SubmissionPageDesktopVotingAreaWidget />}
      {(votingStatus === VotingStatus.VotingOpen || votingStatus === VotingStatus.VotingClosed) && (
        <SubmissionPageDesktopVotingAreaWidgetVoters proposalId={proposalId} />
      )}
    </div>
  );
};

export default SubmissionPageDesktopVotingArea;
