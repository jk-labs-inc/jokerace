import { useTotalRewards } from "@hooks/useTotalRewards";
import { ModuleType, RewardsModuleInfo } from "lib/rewards/types";
import { AnimatePresence } from "motion/react";
import { FC, useEffect, useMemo, useState } from "react";
import { Abi } from "viem";
import RewardCounter from "../RewardsCounter";

interface RewardsDisplayProps {
  rewards: RewardsModuleInfo;
  rewardsModuleAddress: `0x${string}`;
  rewardsAbi: Abi;
  chainId: number;
  isRewardsModuleLoading: boolean;
  isRewardsModuleError: boolean;
}

const RewardsDisplay: FC<RewardsDisplayProps> = ({
  rewards,
  rewardsModuleAddress,
  rewardsAbi,
  chainId,
  isRewardsModuleLoading,
  isRewardsModuleError,
}) => {
  const {
    data: totalRewards,
    isLoading: isTotalRewardsLoading,
    isError: isTotalRewardsError,
  } = useTotalRewards({
    rewardsModuleAddress: rewardsModuleAddress,
    rewardsModuleAbi: rewardsAbi,
    chainId,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const rewardsToDisplay = useMemo(() => {
    const rewards = [];

    // Add native token if it exists and has value
    if (totalRewards?.native && totalRewards.native.value > 0n) {
      rewards.push({
        valueFormatted: totalRewards.native.formatted,
        symbol: totalRewards.native.symbol,
      });
    }

    // Add all token rewards if they exist and have value
    if (totalRewards?.tokens) {
      Object.entries(totalRewards.tokens).forEach(([address, tokenData]) => {
        if (tokenData.value > 0n) {
          rewards.push({
            valueFormatted: tokenData.formatted,
            symbol: tokenData.symbol,
          });
        }
      });
    }

    return rewards;
  }, [totalRewards]);

  const currentReward = rewardsToDisplay[currentIndex];

  useEffect(() => {
    if (rewardsToDisplay.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % rewardsToDisplay.length);
      }, 2000);

      return () => clearInterval(interval);
    } else if (rewardsToDisplay.length === 1) {
      setCurrentIndex(0);
    }
  }, [rewardsToDisplay]);

  if (isRewardsModuleLoading || isRewardsModuleError || !currentReward || isTotalRewardsLoading || isTotalRewardsError)
    return null;

  return (
    <>
      <div className="hidden md:block h-4 w-[2px] bg-primary-2"></div>
      <div className="flex items-baseline gap-1">
        <AnimatePresence mode="wait">
          <RewardCounter
            key={`reward-${currentIndex}`}
            valueFormatted={currentReward.valueFormatted}
            symbol={currentReward.symbol}
            index={currentIndex}
          />
        </AnimatePresence>
        <p className="text-[16px] text-neutral-11">
          to <b>{rewards?.moduleType === ModuleType.VOTER_REWARDS ? "voters" : "contestants"}</b>
        </p>
      </div>
    </>
  );
};

export default RewardsDisplay;
