import { Contest, ContestReward } from "lib/contests";
import { FC } from "react";
import FeaturedContestCard from "./components/Contest";

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
              {contestData?.data.map((contest, index) => (
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
