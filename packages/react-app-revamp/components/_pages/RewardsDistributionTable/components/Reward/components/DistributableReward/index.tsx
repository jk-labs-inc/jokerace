import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import { toastLoading } from "@components/UI/Toast";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useDistributeRewardStore } from "@hooks/useDistributeRewards";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "react-tooltip";

interface DistributableRewardProps {
  queryTokenBalance: any;
  contractWriteRelease: any;
  queryRankRewardsReleasable: any;
  txRelease: any;
}

export const DistributableReward = (props: DistributableRewardProps) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const { setIsLoading } = useDistributeRewardStore(state => state);
  const { queryTokenBalance, contractWriteRelease, queryRankRewardsReleasable, txRelease } = props;

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

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full">
        {queryRankRewardsReleasable.isLoading && <Loader scale="component">Loading info...</Loader>}
        <p>
          {queryRankRewardsReleasable.data} <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>

        {queryRankRewardsReleasable.isSuccess && (
          <div data-tooltip-id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
            {queryRankRewardsReleasable.data > 0 && (
              <ButtonV3
                disabled={contestStatus !== ContestStatus.VotingClosed || txRelease.isLoading}
                size="extraSmall"
                color="bg-gradient-distribute"
                onClick={async () => {
                  toastLoading("distributing rewards...");
                  setIsLoading(true);
                  await contractWriteRelease.writeAsync();
                }}
              >
                distribute
              </ButtonV3>
            )}
          </div>
        )}
        {contestStatus !== ContestStatus.VotingClosed && (
          <Tooltip id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
            <p className="text-[16px]">funds cannot be distributed until voting has ended!</p>
          </Tooltip>
        )}
      </section>
    </li>
  );
};
