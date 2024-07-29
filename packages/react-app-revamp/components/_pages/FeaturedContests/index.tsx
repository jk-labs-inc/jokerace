import { Contest, ContestReward } from "lib/contests";
import { FC } from "react";
import FeaturedContestCard from "./components/Contest";
import Skeleton from "react-loading-skeleton";

interface FeaturedContestsProps {
  status: "error" | "pending" | "success";
  isContestDataFetching: boolean;
  isRewardsFetching: boolean;
  contestData?: {
    data: Contest[];
    count: number | null;
  };
  rewardsData?: (ContestReward | null)[];
}

const FeaturedContests: FC<FeaturedContestsProps> = ({
  status,
  contestData,
  rewardsData,
  isContestDataFetching,
  isRewardsFetching,
}) => {
  const SkeletonCard = () => (
    <div className="w-[320px] flex-shrink-0 lg:w-auto border border-neutral-0 rounded-2xl">
      <div className="p-4 bg-gradient-radial rounded-2xl">
        <Skeleton height={120} baseColor="#212121" highlightColor="#100816" duration={1} borderRadius={12} />
        <div className="mt-4 space-y-2">
          <Skeleton count={3} height={16} baseColor="#212121" highlightColor="#100816" duration={1} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {status === "error" ? (
        <div className={`animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4`}>
          <p className="text-sm font-bold text-negative-10 text-center">Something went wrong</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[16px] text-neutral-14 font-bold uppercase">featured contests</p>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex lg:featured-contests-grid gap-4 pb-4">
              {isContestDataFetching
                ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
                : contestData?.data.map((contest, index) => (
                    <div className="w-[320px] flex-shrink-0 lg:w-auto" key={index}>
                      <FeaturedContestCard
                        contestData={contest}
                        rewardsData={rewardsData?.[index]}
                        isRewardsFetching={isRewardsFetching}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedContests;
