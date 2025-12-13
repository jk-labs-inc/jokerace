import { CONTESTS_FEATURE_COUNT } from "lib/contests/constants";
import { ContestWithTotalRewards, ProcessedContest } from "lib/contests/types";
import { FC } from "react";
import FeaturedContestCard from "./components/Contest";
import SkeletonCard from "./components/SkeletonCard";

interface FeaturedContestsProps {
  status: "error" | "pending" | "success";
  isContestDataFetching: boolean;
  isRewardsFetching: boolean;
  contestData?: ProcessedContest[];
  rewardsData?: ContestWithTotalRewards[];
}

const FeaturedContests: FC<FeaturedContestsProps> = ({
  status,
  contestData,
  rewardsData,
  isRewardsFetching,
  isContestDataFetching,
}) => {
  return (
    <>
      {status === "error" ? (
        <div className={`animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4`}>
          <p className="text-sm font-bold text-negative-10 text-center">Something went wrong</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-neutral-9 font-sabo-filled text-xs block md:hidden">featured contests</p>
          <div className="flex flex-col md:grid md:grid-cols-(--grid-featured-contests) gap-6 pb-4">
            {contestData?.map((contest, index) => (
              <div key={`contest-${index}`}>
                <FeaturedContestCard
                  contestData={contest}
                  rewardsData={rewardsData?.[index]}
                  isRewardsFetching={isRewardsFetching}
                />
              </div>
            ))}

            {isContestDataFetching &&
              Array.from({
                length: Math.max(0, CONTESTS_FEATURE_COUNT - (contestData?.length || 0)),
              }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)}
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedContests;
