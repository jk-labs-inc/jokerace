import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import { formatUnits } from "ethers/lib/utils";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "react-tooltip";

interface DistributableRewardProps {
  queryTokenBalance: any;
  queryRankRewardsReleasable: any;
  handleDistributeRewards?: () => Promise<void>;
}

export const DistributableReward = (props: DistributableRewardProps) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const { isLoading: isDistributeRewardsLoading } = useDistributeRewardStore(state => state);
  const { queryTokenBalance, handleDistributeRewards, queryRankRewardsReleasable } = props;

  if (queryTokenBalance.isLoading)
    return (
      <li className="flex items-center">
        <Skeleton width={200} height={16} />
      </li>
    );

  if (!queryRankRewardsReleasable.data || queryTokenBalance.data.value === 0 || queryRankRewardsReleasable.data === 0) {
    return (
      <li>
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds to distribute
      </li>
    );
  }

  if (queryRankRewardsReleasable.isLoading) {
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading distributable rewards</p>;
  }

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full">
        <p>
          {formatUnits(queryRankRewardsReleasable.data, queryTokenBalance.data?.decimals ?? 18)}{" "}
          <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>

        {queryRankRewardsReleasable.isSuccess ? (
          <div data-tooltip-id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
            {queryRankRewardsReleasable.data > 0 && (
              <ButtonV3
                isDisabled={contestStatus !== ContestStatus.VotingClosed || isDistributeRewardsLoading}
                size={ButtonSize.EXTRA_SMALL}
                colorClass="bg-gradient-distribute"
                onClick={handleDistributeRewards}
              >
                distribute
              </ButtonV3>
            )}
          </div>
        ) : null}
        {contestStatus !== ContestStatus.VotingClosed && (
          <Tooltip id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
            <p className="text-[16px]">funds cannot be distributed until voting has ended!</p>
          </Tooltip>
        )}
      </section>
    </li>
  );
};
