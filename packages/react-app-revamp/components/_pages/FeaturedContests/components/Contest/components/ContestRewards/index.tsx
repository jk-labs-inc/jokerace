import { ContestWithTotalRewards, ProcessedContest } from "lib/contests/types";
import { AnimatePresence, motion } from "motion/react";
import { FC } from "react";
import { getContestState, isContestActive } from "../../helpers";
import { useRewardsCycle } from "./hooks/useRewardsCycle";

interface ContestRewardsProps {
  contestData: ProcessedContest;
  rewardsData?: ContestWithTotalRewards | null;
  isRewardsFetching: boolean;
}

const ContestRewards: FC<ContestRewardsProps> = ({ contestData, rewardsData, isRewardsFetching }) => {
  const { currentReward, currentRewardIndex } = useRewardsCycle(rewardsData);

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
  const showTrendingIcon = currentReward.isNative && contestIsActive;

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
            {currentReward.formatted}
            {showTrendingIcon && <sup className="text-neutral-11">+</sup>}
            {"  "}
            <span className="uppercase">{currentReward.symbol}</span>
            {showTrendingIcon && <span className="inline-block -translate-y-0.5 ml-1">🚀</span>}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContestRewards;
