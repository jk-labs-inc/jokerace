import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePercentageIncrease from "@hooks/useCurrentPricePercentageIncrease";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface ChargeInfoExponentialPercentageIncreaseProps {
  costToVote: number;
}

const SECONDS_UNTIL_NEXT_UPDATE_THRESHOLD = 15;

const ChargeInfoExponentialPercentageIncrease = ({ costToVote }: ChargeInfoExponentialPercentageIncreaseProps) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const [currentTime, setCurrentTime] = useState(() => Math.floor(Date.now() / 1000));
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));

  const totalVotingMinutes =
    voteTimings?.contestDeadline && voteTimings?.voteStart
      ? Math.floor((Number(voteTimings?.contestDeadline) - Number(voteTimings?.voteStart)) / 60)
      : 0;

  const votingTimeLeft = voteTimings?.contestDeadline
    ? Math.max(0, Number(voteTimings?.contestDeadline) - currentTime)
    : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const {
    currentPricePercentageData,
    isLoading: isPriceLoading,
    isError: isPriceError,
  } = useCurrentPricePercentageIncrease({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    costToVote,
    totalVotingMinutes,
  });

  const {
    priceCurveUpdateInterval,
    isLoading: isIntervalLoading,
    isError: isIntervalError,
  } = usePriceCurveUpdateInterval({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  const secondsUntilNextUpdate = priceCurveUpdateInterval > 0 ? votingTimeLeft % priceCurveUpdateInterval : 0;

  if (isPriceLoading || isIntervalLoading) {
    return null;
  }

  if (isPriceError || isIntervalError) {
    return null;
  }

  if (
    !voteTimings?.voteStart ||
    !voteTimings?.contestDeadline ||
    totalVotingMinutes === 0 ||
    !currentPricePercentageData
  ) {
    return null;
  }

  if (votingTimeLeft <= 60) {
    return null;
  }

  if (isPriceError || !currentPricePercentageData) {
    return <p className="text-[12px] text-neutral-9">increases in {secondsUntilNextUpdate} seconds</p>;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-neutral-9">
        increases{" "}
        {currentPricePercentageData?.isBelowThreshold ? "" : `${currentPricePercentageData?.percentageIncrease}% `}
        in {secondsUntilNextUpdate} seconds
      </p>
      {secondsUntilNextUpdate < SECONDS_UNTIL_NEXT_UPDATE_THRESHOLD && (
        <p className="text-[12px] text-secondary-11 animate-pulse">wait for price update or tx may fail</p>
      )}
    </div>
  );
};

export default ChargeInfoExponentialPercentageIncrease;
