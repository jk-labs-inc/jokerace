import useContestVoteDeadline from "@components/_pages/Submission/hooks/useContestVoteDeadline";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePercentageIncrease from "@hooks/useCurrentPricePercentageIncrease";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import { useShallow } from "zustand/shallow";

interface ChargeInfoExponentialPercentageIncreaseProps {
  costToVote: number;
}

const SECONDS_UNTIL_NEXT_UPDATE_THRESHOLD = 15;

const ChargeInfoExponentialPercentageIncrease = ({ costToVote }: ChargeInfoExponentialPercentageIncreaseProps) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const {
    voteStart,
    contestDeadline,
    isLoading: isVotingPeriodLoading,
    isError: isVotingPeriodError,
  } = useContestVoteDeadline({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });

  const totalVotingMinutes =
    contestDeadline && voteStart ? Math.floor((Number(contestDeadline) - Number(voteStart)) / 60) : 0;

  const now = Math.floor(Date.now() / 1000);
  const votingTimeLeft = contestDeadline ? Math.max(0, Number(contestDeadline) - now) : 0;

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

  if (isVotingPeriodLoading || isPriceLoading || isIntervalLoading) {
    return null;
  }

  if (isVotingPeriodError || isPriceError || isIntervalError) {
    return null;
  }

  if (!voteStart || !contestDeadline || totalVotingMinutes === 0 || !currentPricePercentageData) {
    return null;
  }

  if (votingTimeLeft <= 60) {
    return null;
  }

  if (isPriceError || !currentPricePercentageData || currentPricePercentageData.isBelowThreshold) {
    return <p className="text-[12px] text-neutral-9">increases in {secondsUntilNextUpdate} seconds</p>;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-neutral-9">
        increases {currentPricePercentageData?.percentageIncrease}% in {secondsUntilNextUpdate} seconds
      </p>
      {secondsUntilNextUpdate < SECONDS_UNTIL_NEXT_UPDATE_THRESHOLD && (
        <p className="text-[12px] text-secondary-11 animate-pulse">wait for price update or tx may fail</p>
      )}
    </div>
  );
};

export default ChargeInfoExponentialPercentageIncrease;
