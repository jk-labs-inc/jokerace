import useContestVoteTimer from "@components/_pages/Submission/hooks/useContestVoteTimer";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopVotingAreaWidget from "./components/Widget";
import SubmissionPageDesktopVotingAreaWidgetVoters from "./components/Widget/components/Voters";

const SubmissionPageDesktopVotingArea = () => {
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const { isVotingOpen, isLoading, isError } = useContestVoteTimer({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
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

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col p-4 gap-4 bg-primary-1 rounded-4xl xl:w-[480px]"
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined, height: maxHeight ? `${maxHeight}px` : undefined }}
    >
      {isVotingOpen && <SubmissionPageDesktopVotingAreaWidget />}
      <SubmissionPageDesktopVotingAreaWidgetVoters proposalId={proposalId} isVotingOpen={isVotingOpen} />
    </div>
  );
};

export default SubmissionPageDesktopVotingArea;
