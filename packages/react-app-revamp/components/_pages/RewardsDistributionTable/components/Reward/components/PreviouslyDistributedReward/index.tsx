import { formatUnits } from "ethers/lib/utils";
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

  if (!queryRankRewardsReleased.data || queryRankRewardsReleased.data.value === 0) {
    return (
      <li className="no-funds-distributed">
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds distributed
      </li>
    );
  }

  if (queryRankRewardsReleased.isLoading) {
    return (
      <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading previously distributable rewards</p>
    );
  }

  return (
    <li className="flex items-center text-positive-11 funds-distributed">
      <section className="flex justify-between w-full">
        <p>
          {formatUnits(queryRankRewardsReleased.data, queryTokenBalance.data.decimals ?? 18)}{" "}
          <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>
      </section>
    </li>
  );
};
