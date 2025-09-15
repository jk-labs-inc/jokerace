import { ContestWithTotalRewards } from "lib/contests/types";
import { FC, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "motion/react";

interface ContestRewardsProps {
  rewards: ContestWithTotalRewards;
  loading: boolean;
  rewardsLoading: boolean;
}

const ContestRewards: FC<ContestRewardsProps> = ({ rewards, loading, rewardsLoading }) => {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  const rewardsToDisplay = useMemo(() => {
    if (!rewards?.hasRewards || !rewards.rewardsData) return [];

    const rewardsArray = [];
    const { native, tokens } = rewards.rewardsData;

    if (native && native.value > 0n) {
      rewardsArray.push({
        amount: native.value,
        decimals: native.decimals,
        symbol: native.symbol,
        formatted: native.formatted,
      });
    }

    if (tokens) {
      Object.entries(tokens).forEach(([address, tokenData]) => {
        if (tokenData.value > 0n) {
          rewardsArray.push({
            amount: tokenData.value,
            decimals: tokenData.decimals,
            symbol: tokenData.symbol,
            formatted: tokenData.formatted,
          });
        }
      });
    }

    return rewardsArray;
  }, [rewards]);

  const currentReward = rewardsToDisplay[currentRewardIndex];

  // Cycle through rewards if there are multiple
  useEffect(() => {
    if (rewardsToDisplay.length > 1) {
      const interval = setInterval(() => {
        setCurrentRewardIndex(prevIndex => (prevIndex + 1) % rewardsToDisplay.length);
      }, 2000);

      return () => clearInterval(interval);
    } else if (rewardsToDisplay.length === 1) {
      setCurrentRewardIndex(0);
    }
  }, [rewardsToDisplay]);

  return (
    <div className="flex flex-col">
      {rewardsLoading || loading ? (
        <Skeleton />
      ) : currentReward ? (
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.p
              key={`reward-${currentRewardIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-bold w-full text-neutral-11"
            >
              {currentReward.formatted} <span className="uppercase">{currentReward.symbol}</span>
            </motion.p>
          </AnimatePresence>
          <p className="text-[16px] text-neutral-9">in rewards</p>
        </div>
      ) : null}
    </div>
  );
};

export default ContestRewards;
