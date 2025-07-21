import { useTotalRewards } from "@hooks/useTotalRewards";
import { AnimatePresence } from "motion/react";
import { FC, useEffect, useMemo, useState } from "react";
import { Abi } from "viem";
import RewardCounter from "../RewardsCounter";
import useRewardsModule from "@hooks/useRewards";
import { ModuleType } from "lib/rewards/types";

interface RewardsDisplayProps {
  rewardsModuleAddress: `0x${string}`;
  rewardsAbi: Abi;
  chainId: number;
  payees: number[];
}

const RewardsDisplay: FC<RewardsDisplayProps> = ({ rewardsModuleAddress, rewardsAbi, chainId, payees }) => {
  const {
    data: totalRewards,
    isLoading: isTotalRewardsLoading,
    isError: isTotalRewardsError,
  } = useTotalRewards({
    rewardsModuleAddress: rewardsModuleAddress,
    rewardsModuleAbi: rewardsAbi,
    chainId,
  });
  const { data: rewards, isLoading: isRewardsLoading, isError: isRewardsError } = useRewardsModule();

  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoading = isTotalRewardsLoading || isRewardsLoading;
  const isError = isTotalRewardsError || isRewardsError;

  const rewardsToDisplay = useMemo(() => {
    const rewards = [];

    // Add native token if it exists and has value
    if (totalRewards?.native && totalRewards.native.value > 0n) {
      rewards.push({
        amount: totalRewards.native.value,
        decimals: totalRewards.native.decimals,
        symbol: totalRewards.native.symbol,
      });
    }

    // Add all token rewards if they exist and have value
    if (totalRewards?.tokens) {
      Object.entries(totalRewards.tokens).forEach(([address, tokenData]) => {
        if (tokenData.value > 0n) {
          rewards.push({
            amount: tokenData.value,
            decimals: tokenData.decimals,
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

  if (isLoading || isError || !currentReward) return null;

  return (
    <>
      <div className="hidden md:block h-4 w-[2px] bg-primary-2"></div>
      <div className="flex items-baseline gap-1">
        <AnimatePresence mode="wait">
          <RewardCounter
            key={`reward-${currentIndex}`}
            amount={currentReward.amount}
            decimals={currentReward.decimals}
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
