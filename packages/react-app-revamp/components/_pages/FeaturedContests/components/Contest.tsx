import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import { Contest, ContestReward } from "lib/contests";
import moment from "moment";
import Link from "next/link";
import { FC, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

interface FeaturedContestCardProps {
  isRewardsFetching: boolean;
  contestData: Contest;
  rewardsData?: ContestReward | null;
}

function getContestStatus(contest: Contest): { status: string; timeLeft: string } {
  const now = moment();
  const start = moment(contest.start_at);
  const voteStart = moment(contest.vote_start_at);
  const end = moment(contest.end_at);

  if (now.isBefore(start)) {
    const duration = moment.duration(start.diff(now));
    return {
      status: "Submissions open in",
      timeLeft: formatDuration(duration),
    };
  } else if (now.isBefore(voteStart)) {
    const duration = moment.duration(voteStart.diff(now));
    return {
      status: "Submissions close in",
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
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

const FeaturedContestCard: FC<FeaturedContestCardProps> = ({ contestData, rewardsData, isRewardsFetching }) => {
  const [contestStatus, setContestStatus] = useState(getContestStatus(contestData));
  const { status, timeLeft } = contestStatus;
  const isContestActive = status === "Submissions close in" || status === "Voting closes in";

  const updateInterval = useCallback(() => {
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

    const interval = setInterval(() => {
      updateStatus();
      clearInterval(interval);
      const newInterval = updateInterval();
      setInterval(updateStatus, newInterval);
    }, updateInterval());

    return () => clearInterval(interval); // Cleanup on unmount
  }, [contestData, updateInterval]);

  const getContestUrl = (network_name: string, address: string) => {
    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", network_name).replace("[address]", address);
  };

  return (
    <Link
      href={getContestUrl(contestData.network_name ?? "", contestData.address ?? "")}
      className="flex flex-col justify-between w-[320px] h-[216px] pt-4 pb-3 px-8 bg-gradient-radial rounded-[16px] border border-neutral-0 hover:border-neutral-10 transition-all duration-300 ease-in-out"
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
          ) : rewardsData && (rewardsData.token || rewardsData.rewardsPaidOut) ? (
            <div className="animate-reveal flex items-center h-6 border border-neutral-10 rounded-[8px] px-2">
              {rewardsData.token ? (
                <p className="text-positive-11 font-bold text-[12px]">
                  {rewardsData.token.value} <span className="uppercase">${rewardsData.token.symbol}</span>
                </p>
              ) : rewardsData.rewardsPaidOut ? (
                <p className="font-bold text-positive-11 text-[12px]">rewards paid out!</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-center h-6 bg-neutral-7 px-2 border-true-black border rounded-[8px]">
            <p className="text-neutral-11 font-bold text-[12px]">{contestData.type}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[18px] font-bold text-true-white normal-case">{contestData.title}</p>
          <p className="flex items-center gap-2 text-[12px] font-bold text-neutral-11">
            {isContestActive && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-10 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-positive-11"></span>
              </span>
            )}
            <span>
              {status} <span className="text-true-white">{timeLeft}</span>
            </span>
          </p>
        </div>
      </div>

      <UserProfileDisplay ethereumAddress={contestData.author_address ?? ""} size="extraSmall" shortenOnFallback />
    </Link>
  );
};

export default FeaturedContestCard;
