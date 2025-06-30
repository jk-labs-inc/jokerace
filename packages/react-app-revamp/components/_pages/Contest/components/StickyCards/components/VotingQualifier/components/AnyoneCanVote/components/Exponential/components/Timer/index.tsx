import { ArrowLongUpIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";

interface VotingQualifierAnyoneCanVoteExponentialTimerProps {
  votingTimeLeft: number;
  priceCurveUpdateInterval: number;
}

const VotingQualifierAnyoneCanVoteExponentialTimer: FC<VotingQualifierAnyoneCanVoteExponentialTimerProps> = ({
  votingTimeLeft,
  priceCurveUpdateInterval,
}) => {
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;
  const secondsUntilNextUpdate = votingTimeLeft % 60;

  if (!isVotingOpen) {
    return <p className="text-[12px] text-neutral-9">(start - finish of voting)</p>;
  }

  return (
    <div className="flex items-center gap-1">
      <ArrowLongUpIcon className="w-4 h-4 text-neutral-9" />
      <p className="text-[12px] text-neutral-9">in {secondsUntilNextUpdate} seconds</p>
    </div>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialTimer;
