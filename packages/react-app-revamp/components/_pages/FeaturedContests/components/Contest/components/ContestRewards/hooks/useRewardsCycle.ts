import { ContestWithTotalRewards } from "lib/contests/types";
import { useEffect, useMemo, useState } from "react";
import { RewardDisplayData } from "../../../types";

const CYCLE_INTERVAL_MS = 2000;

interface UseRewardsCycleResult {
  currentReward: RewardDisplayData | undefined;
  currentRewardIndex: number;
  rewardsCount: number;
}

export const useRewardsCycle = (rewardsData?: ContestWithTotalRewards | null): UseRewardsCycleResult => {
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

  useEffect(() => {
    if (rewardsToDisplay.length <= 1) {
      setCurrentRewardIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentRewardIndex(prevIndex => (prevIndex + 1) % rewardsToDisplay.length);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [rewardsToDisplay.length]);

  return {
    currentReward: rewardsToDisplay[currentRewardIndex],
    currentRewardIndex,
    rewardsCount: rewardsToDisplay.length,
  };
};
