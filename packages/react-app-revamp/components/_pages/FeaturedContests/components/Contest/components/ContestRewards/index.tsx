import { ContestWithTotalRewards, ProcessedContest } from "lib/contests/types";
import { AnimatePresence, motion } from "motion/react";
import { FC, useEffect, useMemo, useState } from "react";
import { isContestActive } from "../../helpers";
import { RewardDisplayData } from "../../types";

interface ContestRewardsProps {
  contestData: ProcessedContest;
  rewardsData?: ContestWithTotalRewards | null;
  isRewardsFetching: boolean;
}

const ContestRewards: FC<ContestRewardsProps> = ({ contestData, rewardsData, isRewardsFetching }) => {
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  const rewardsToDisplay = useMemo((): RewardDisplayData[] => {
    if (!rewardsData?.hasRewards || !rewardsData.rewardsData) return [];

    const rewards: RewardDisplayData[] = [];
    const { native, tokens } = rewardsData.rewardsData;

    if (native && native.value > 0n) {
      rewards.push({
        amount: native.value,
        decimals: native.decimals,
        symbol: native.symbol,
        formatted: native.formatted,
        isNative: true,
      });
    }

    if (tokens) {
      Object.entries(tokens).forEach(([, tokenData]) => {
        if (tokenData.value > 0n) {
          rewards.push({
            amount: tokenData.value,
            decimals: tokenData.decimals,
            symbol: tokenData.symbol,
            formatted: tokenData.formatted,
            isNative: false,
          });
        }
      });
    }

    return rewards;
  }, [rewardsData]);

  const currentReward = rewardsToDisplay[currentRewardIndex];

  // Cycle through rewards if there are multiple
  useEffect(() => {
    if (rewardsToDisplay.length <= 1) {
      setCurrentRewardIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentRewardIndex(prevIndex => (prevIndex + 1) % rewardsToDisplay.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [rewardsToDisplay.length]);

  if (isRewardsFetching) {
    return (
      <div className="flex items-center gap-1">
        <span role="img" aria-label="money bag">
          💰
        </span>
        <div className="w-16 h-4 bg-neutral-5 rounded animate-pulse" />
      </div>
    );
  }

  if (!currentReward) return null;

  const contestIsActive = isContestActive(contestData);

  return (
    <div className="flex items-center gap-1">
      <span role="img" aria-label="money bag" className="shrink-0">
        💰
      </span>
      <div className="relative h-4 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={`reward-${currentRewardIndex}`}
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            className={`text-xs font-bold whitespace-nowrap ${contestIsActive ? "text-neutral-11" : "text-neutral-9"}`}
            style={{ willChange: "transform" }}
          >
            {currentReward.formatted} <span className="uppercase">{currentReward.symbol}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContestRewards;
