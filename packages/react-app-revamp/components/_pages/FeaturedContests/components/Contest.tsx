import CustomLink from "@components/UI/Link";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import { ContestWithTotalRewards, ProcessedContest } from "lib/contests/types";
import { FC, useEffect, useMemo, useState } from "react";
import ContestCardContainer from "./Contest/components/Container";
import ContestState from "./Contest/components/ContestState";
import ContestTiming from "./Contest/components/ContestTiming";
import ContestTitle from "./Contest/components/ContestTitle";
import { getContestState, getContestTitleState, getUpdateInterval } from "./Contest/helpers";

interface FeaturedContestCardProps {
  isRewardsFetching: boolean;
  contestData: ProcessedContest;
  rewardsData?: ContestWithTotalRewards | null;
}

const FeaturedContestCard: FC<FeaturedContestCardProps> = ({ contestData, rewardsData, isRewardsFetching }) => {
  const [contestState, setContestState] = useState(getContestState(contestData));
  const [titleState, setTitleState] = useState(getContestTitleState(contestData));
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  const rewardsToDisplay = useMemo(() => {
    if (!rewardsData?.hasRewards || !rewardsData.rewardsData) return [];

    const rewards = [];
    const { native, tokens } = rewardsData.rewardsData;

    if (native && native.value > 0n) {
      rewards.push({
        amount: native.value,
        decimals: native.decimals,
        symbol: native.symbol,
        formatted: native.formatted,
      });
    }

    if (tokens) {
      Object.entries(tokens).forEach(([address, tokenData]) => {
        if (tokenData.value > 0n) {
          rewards.push({
            amount: tokenData.value,
            decimals: tokenData.decimals,
            symbol: tokenData.symbol,
            formatted: tokenData.formatted,
          });
        }
      });
    }

    return rewards;
  }, [rewardsData]);

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

  useEffect(() => {
    const updateStatus = () => {
      setContestState(getContestState(contestData));
      setTitleState(getContestTitleState(contestData));
    };

    updateStatus();

    const intervalTime = getUpdateInterval(contestData);
    const interval = setInterval(() => {
      updateStatus();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [contestData]);

  const getContestUrl = (network_name: string, address: string) => {
    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", network_name).replace("[address]", address);
  };

  return (
    <CustomLink
      className="flex flex-col gap-2 animate-appear"
      prefetch={true}
      href={getContestUrl(contestData.network_name ?? "", contestData.address ?? "")}
    >
      <ContestCardContainer prompt={contestData.prompt}>
        <ContestState state={contestState} />
        <ContestTitle title={contestData.title} state={titleState} />
      </ContestCardContainer>
      <div className="pl-4">
        <ContestTiming contest={contestData} />
      </div>
    </CustomLink>
  );
};

export default FeaturedContestCard;
