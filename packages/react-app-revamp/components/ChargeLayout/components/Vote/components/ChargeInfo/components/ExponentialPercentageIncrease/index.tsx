import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestTimings } from "@hooks/useContestTimings";
import useCurrentPricePercentageIncrease from "@hooks/useCurrentPricePercentageIncrease";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface ChargeInfoExponentialPercentageIncreaseProps {
  costToVote: bigint;
}

const SECONDS_UNTIL_NEXT_UPDATE_THRESHOLD = 15;

const ChargeInfoExponentialPercentageIncrease = ({ costToVote }: ChargeInfoExponentialPercentageIncreaseProps) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { contestDeadline, voteStart } = useContestTimings({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });
  const [currentTime, setCurrentTime] = useState(() => Math.floor(Date.now() / 1000));
  const totalVotingMinutes =
    contestDeadline && voteStart ? Math.floor((contestDeadline.getTime() - voteStart.getTime()) / 1000 / 60) : 0;
  const votingTimeLeft = contestDeadline ? Math.max(0, Math.floor(contestDeadline.getTime() / 1000) - currentTime) : 0;

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const secondsUntilNextUpdate = priceCurveUpdateInterval > 0 ? votingTimeLeft % priceCurveUpdateInterval : 0;

  if (isPriceLoading || isIntervalLoading) {
    return null;
  }

  if (isPriceError || isIntervalError) {
    return null;
  }

  if (totalVotingMinutes === 0 || !currentPricePercentageData) {
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
