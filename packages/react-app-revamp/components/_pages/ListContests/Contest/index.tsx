import CustomLink from "@components/UI/Link";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import { ContestWithTotalRewards } from "lib/contests/types";
import { FC, useEffect, useMemo, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

interface ContestProps {
  contest: any;
  rewards: ContestWithTotalRewards | null;
  loading: boolean;
  rewardsLoading: boolean;
}

export type TimeLeft = {
  value: number;
  type: "days" | "hours" | "minutes";
};

const Contest: FC<ContestProps> = ({ contest, loading, rewards, rewardsLoading }) => {
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

  const getContestUrl = (contest: { network_name: string; address: string }) => {
    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", contest.network_name).replace("[address]", contest.address);
  };

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <CustomLink href={getContestUrl(contest)}>
        <p>hi</p>
      </CustomLink>
    </SkeletonTheme>
  );
};

export default Contest;
