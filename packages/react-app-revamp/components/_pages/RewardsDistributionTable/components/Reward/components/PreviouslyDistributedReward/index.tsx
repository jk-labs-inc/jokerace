import Loader from "@components/UI/Loader";
import Skeleton from "react-loading-skeleton";

interface PreviouslyDistributedRewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleased: any;
}

export const PreviouslyDistributedReward = (props: PreviouslyDistributedRewardProps) => {
  const { queryTokenBalance, queryRankRewardsReleased } = props;

  if (queryTokenBalance.isLoading)
    return (
      <li className="flex items-center">
        <Skeleton width={200} height={16} />
      </li>
    );

  if (queryRankRewardsReleased.data === 0) {
    return (
      <li className="no-funds-distributed">
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds distributed
      </li>
    );
  }

  return (
    <li className="flex items-center text-positive-11 funds-distributed">
      <section className="flex justify-between w-full">
        {queryRankRewardsReleased.isLoading && <Loader scale="component">Loading info...</Loader>}
        <p>
          {queryRankRewardsReleased.data} <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>
      </section>
    </li>
  );
};
