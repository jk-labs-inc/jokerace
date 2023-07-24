import Loader from "@components/UI/Loader";

interface PreviouslyDistributedRewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleased: any;
}

export const PreviouslyDistributedReward = (props: PreviouslyDistributedRewardProps) => {
  const { queryTokenBalance, queryRankRewardsReleased } = props;

  if (queryTokenBalance.isLoading) return <Loader scale="component">Loading ERC20 token info...</Loader>;

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
