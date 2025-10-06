import useContestVoteTimer, { VotingStatus } from "@components/_pages/Submission/hooks/useContestVoteTimer";
import useProposalIdStore from "@hooks/useProposalId/store";
import { useEffect, useRef, useState } from "react";
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
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const leftContainer = document.getElementById("submission-body-container");

    if (!leftContainer) return;

    const updateMaxHeight = () => {
      const height = leftContainer.getBoundingClientRect().height;
      setMaxHeight(height);
    };

    updateMaxHeight();

    observerRef.current = new ResizeObserver(updateMaxHeight);
    observerRef.current.observe(leftContainer);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div
      className="flex flex-col p-4 gap-4 bg-primary-1 rounded-4xl xl:w-[480px]"
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined, height: maxHeight ? `${maxHeight}px` : undefined }}
    >
      {votingStatus === VotingStatus.VotingNotOpen && (
        <SubmissionPageDesktopVotingAreaWidgetVotingNotOpen timeRemaining={timeRemaining} />
      )}
      {votingStatus === VotingStatus.VotingOpen && <SubmissionPageDesktopVotingAreaWidget />}
      {(votingStatus === VotingStatus.VotingOpen || votingStatus === VotingStatus.VotingClosed) && (
        <SubmissionPageDesktopVotingAreaWidgetVoters proposalId={proposalId} isVotingOpen={isVotingOpen} />
      )}
    </div>
  );
};

export default SubmissionPageDesktopVotingArea;
