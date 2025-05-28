import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import { AnimatePresence } from "motion/react";
import { FC, useEffect, useMemo, useState } from "react";
import { Abi } from "viem";
import RewardCounter from "../RewardsCounter";

interface RewardsDisplayProps {
  rewardsModuleAddress: `0x${string}`;
  rewardsAbi: Abi;
  chainId: number;
  payees: number[];
}

const RewardsDisplay: FC<RewardsDisplayProps> = ({ rewardsModuleAddress, rewardsAbi, chainId, payees }) => {
  const {
    data: releasableRewards,
    isLoading: isReleasableLoading,
    isContractError: isReleasableError,
  } = useReleasableRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings: payees,
  });

  const {
    data: releasedRewards,
    isLoading: isReleasedLoading,
    isContractError: isReleasedError,
  } = useReleasedRewards({
    contractAddress: rewardsModuleAddress,
    chainId,
    abi: rewardsAbi,
    rankings: payees,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoading = isReleasableLoading || isReleasedLoading;
  const isError = isReleasableError || isReleasedError;

  const flattenedRewards = useMemo(() => {
    const released =
      releasedRewards?.flatMap(reward =>
        reward.tokens.map(token => ({ ...token, isReleased: true, ranking: reward.ranking })),
      ) || [];
    const releasable =
      releasableRewards?.flatMap(reward =>
        reward.tokens.map(token => ({ ...token, isReleased: false, ranking: reward.ranking })),
      ) || [];
    return [...released, ...releasable];
  }, [releasedRewards, releasableRewards]);

  const currentReward = flattenedRewards[currentIndex];

  useEffect(() => {
    if (flattenedRewards.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % flattenedRewards.length);
      }, 2000);

      return () => clearInterval(interval);
    } else if (flattenedRewards.length === 1) {
      setCurrentIndex(0);
    }
  }, [flattenedRewards]);

  if (isLoading || isError || !currentReward) return null;

  return (
    <>
      <div className="h-4 w-[2px] bg-primary-2"></div>
      <div className="flex items-baseline">
        <AnimatePresence mode="wait">
          <RewardCounter
            key={`reward-${currentIndex}`}
            amount={currentReward.amount ?? 0n}
            decimals={currentReward.decimals ?? 18}
            symbol={currentReward.symbol}
            index={currentIndex}
          />
        </AnimatePresence>

        <span className="text-[12px] md:text-[16px] font-bold text-neutral-11 ml-1">
          {currentReward.isReleased ? "paid to" : "to"} {currentReward.ranking}
          <sup>{returnOnlySuffix(currentReward.ranking)}</sup>
        </span>
        <span className="text-[12px] md:text-[16px] font-bold text-neutral-11 ml-1">place</span>
      </div>
    </>
  );
};

export default RewardsDisplay;
