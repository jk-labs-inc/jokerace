import { ContestType } from "@components/_pages/Create/types";
import { Avatar } from "@components/UI/Avatar";
import CustomLink from "@components/UI/Link";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import useProfileData from "@hooks/useProfileData";
import { Contest, ContestWithTotalRewards } from "lib/contests/types";
import moment from "moment";
import { AnimatePresence, motion } from "motion/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";

interface FeaturedContestCardProps {
  isRewardsFetching: boolean;
  contestData: Contest;
  rewardsData?: ContestWithTotalRewards | null;
}

function getContestStatus(contest: Contest): { status: string; timeLeft: string } {
  const now = moment();
  const start = moment(contest.start_at);
  const voteStart = moment(contest.vote_start_at);
  const end = moment(contest.end_at);

  if (now.isBefore(start)) {
    const duration = moment.duration(start.diff(now));
    return {
      status: "enter to win in",
      timeLeft: formatDuration(duration),
    };
  } else if (now.isBefore(voteStart)) {
    const duration = moment.duration(voteStart.diff(now));
    return {
      status: "enter to win within",
      timeLeft: formatDuration(duration),
    };
  } else if (now.isBefore(end)) {
    const duration = moment.duration(end.diff(now));
    return {
      status: "Voting closes in",
      timeLeft: formatDuration(duration),
    };
  } else {
    return { status: "Contest ended", timeLeft: "" };
  }
}

function formatDuration(duration: moment.Duration): string {
  const totalDays = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (totalDays > 0) {
    return `${totalDays}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

const FeaturedContestCard: FC<FeaturedContestCardProps> = ({ contestData, rewardsData, isRewardsFetching }) => {
  const [contestStatus, setContestStatus] = useState(getContestStatus(contestData));
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

  const { status, timeLeft } = contestStatus;
  const isContestActive = status === "enter to win within" || status === "Voting closes in";
  const {
    profileAvatar,
    profileName,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
  } = useProfileData(contestData.author_address ?? "", true);

  const getUpdateInterval = useCallback(() => {
    const now = moment();
    let nextUpdate = moment(contestData.end_at);

    if (contestData.start_at && now.isBefore(contestData.start_at)) {
      nextUpdate = moment(contestData.start_at);
    } else if (contestData.vote_start_at && now.isBefore(contestData.vote_start_at)) {
      nextUpdate = moment(contestData.vote_start_at);
    }

    const duration = moment.duration(nextUpdate.diff(now));
    const days = duration.asDays();
    const hours = duration.asHours();

    if (days > 1) {
      return 60 * 60 * 1000; // Update every hour
    } else if (hours > 1) {
      return 60 * 1000; // Update every minute
    } else {
      return 1000; // Update every second
    }
  }, [contestData]);

  useEffect(() => {
    const updateStatus = () => {
      setContestStatus(getContestStatus(contestData));
    };

    updateStatus();

    const intervalTime = getUpdateInterval();
    const interval = setInterval(() => {
      updateStatus();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [contestData, getUpdateInterval]);

  const getContestUrl = (network_name: string, address: string) => {
    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", network_name).replace("[address]", address);
  };

  const formatContestType = (type: string | null) => {
    if (!type) return "";

    switch (type) {
      case ContestType.AnyoneCanPlay:
        return "anyone can enter & vote";
      case ContestType.EntryContest:
        return "anyone can enter";
      case ContestType.VotingContest:
        return "anyone can vote";
      default:
        return type;
    }
  };

  return (
    <CustomLink
      prefetch={true}
      href={getContestUrl(contestData.network_name ?? "", contestData.address ?? "")}
      className="animate-appear flex flex-col justify-between w-[320px] h-[216px] pt-4 pb-3 px-6 bg-gradient-radial rounded-[16px] border border-neutral-0 hover:border-neutral-10 transition-all duration-300 ease-in-out"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          {isRewardsFetching ? (
            <Skeleton
              width={60}
              height={24}
              baseColor="#212121"
              highlightColor="#100816"
              className="border border-neutral-10"
              borderRadius={8}
              duration={1}
            />
          ) : currentReward ? (
            <div className="animate-appear flex items-center h-6 border border-neutral-10 rounded-[8px] px-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`reward-${currentRewardIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-positive-11 font-bold text-[12px]"
                >
                  {currentReward.formatted} <span className="uppercase">{currentReward.symbol}</span>
                </motion.p>
              </AnimatePresence>
            </div>
          ) : null}

          <div className="flex items-center h-6 bg-neutral-7 px-2 border-true-black border rounded-[8px]">
            <p className="text-neutral-11 font-bold text-[12px]">{formatContestType(contestData.type)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[18px] font-bold text-true-white normal-case">
            {contestData.title ? contestData.title : "👀 Contest 👀"}
          </p>

          <div className="flex items-center gap-2 text-[12px] font-bold text-neutral-11">
            {isContestActive && !contestData.isCanceled && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-10 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-positive-11"></span>
              </span>
            )}
            {contestData.isCanceled ? (
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-negative-11 w-2 h-2"></div>
                <span>canceled</span>
              </div>
            ) : (
              <span>
                {status} <span className="text-true-white">{timeLeft}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {isUserProfileLoading ? (
        <Skeleton width={150} height={16} baseColor="#212121" highlightColor="#100816" />
      ) : isUserProfileError ? (
        <p className="text-negative-11 font-bold text-[12px]">ruh-roh, couldn't load creator name!</p>
      ) : (
        <div className="flex gap-2 items-center">
          <Avatar src={profileAvatar} size="extraSmall" />
          <p className="text-neutral-11 font-bold text-[12px]">{profileName}</p>
        </div>
      )}
    </CustomLink>
  );
};

export default FeaturedContestCard;
