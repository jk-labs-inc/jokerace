import Loader from "@components/UI/Loader";
import Skeleton from "react-loading-skeleton";

interface PreviouslyDistributedRewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleased: number;
  isReleasedRewardsLoading: boolean;
}

export const PreviouslyDistributedReward = (props: PreviouslyDistributedRewardProps) => {
  const { queryTokenBalance, queryRankRewardsReleased, isReleasedRewardsLoading } = props;

  if (queryTokenBalance.isLoading)
    return (
      <li className="flex items-center">
        <Skeleton width={200} height={16} />
      </li>
    );

  if (!queryRankRewardsReleased) {
    return (
      <li className="no-funds-distributed">
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds distributed
      </li>
    );
  }

  return (
    <li className="flex items-center text-positive-11 funds-distributed">
      <section className="flex justify-between w-full">
        {isReleasedRewardsLoading && <Loader scale="component">Loading info...</Loader>}
        <p>
          {queryRankRewardsReleased} <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>
      </section>
    </li>
  );
};
