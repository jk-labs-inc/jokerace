import { ArrowLongUpIcon } from "@heroicons/react/24/outline";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useCurrentPricePercentageIncrease from "@hooks/useCurrentPricePercentageIncrease";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/react/shallow";

interface VotingQualifierAnyoneCanVoteExponentialTimerProps {
  votingTimeLeft: number;
  priceCurveUpdateInterval: number;
}

const VotingQualifierAnyoneCanVoteExponentialTimer: FC<VotingQualifierAnyoneCanVoteExponentialTimerProps> = ({
  votingTimeLeft,
  priceCurveUpdateInterval,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const isVotingOpen = contestStatus === ContestStatus.VotingOpen;
  const secondsUntilNextUpdate = votingTimeLeft % priceCurveUpdateInterval;
  const { address, abi, chainId, version, votingClose } = useContestStore(
    useShallow(state => ({
      address: state.contestInfoData.contestAddress,
      abi: state.contestAbi,
      chainId: state.contestInfoData.contestChainId,
      version: state.version,
      votingClose: state.votesClose,
    })),
  );

  const { currentPercentageIncrease, isError } = useCurrentPricePercentageIncrease({
    address,
    abi,
    chainId,
    version,
    votingClose,
  });

  if (!isVotingOpen) {
    return <p className="text-[12px] text-neutral-9">(start - finish of voting)</p>;
  }

  // Hide timer in the last 60 seconds of voting
  if (votingTimeLeft <= 60) {
    return null;
  }

  if (isError) {
    <div className="flex items-center gap-1">
      <ArrowLongUpIcon className="w-4 h-4 text-neutral-9" />
      <p className="text-[12px] text-neutral-9">
        in {secondsUntilNextUpdate} {isMobile ? "sec" : "seconds"}
      </p>
    </div>;
  }

  if (isMobile) {
    return (
      <div className="flex items-center">
        <ArrowLongUpIcon className="w-4 h-4 text-neutral-9" />
        <p className="text-[12px] text-neutral-9">
          {currentPercentageIncrease}% in {secondsUntilNextUpdate} sec
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <p className="text-[12px] text-neutral-9">
        | increases {currentPercentageIncrease}% in {secondsUntilNextUpdate} seconds
      </p>
    </div>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialTimer;
