import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import { toastLoading } from "@components/UI/Toast";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { Tooltip } from "react-tooltip";

interface RewardProps {
  share: any;
  chainId: number;
  queryTokenBalance: any;
  contractWriteRelease: any;
  txRelease: any;
  queryRankRewardsReleasable: any;
  queryRankRewardsReleased: any;
  showPreviouslyDistributed?: boolean;
}

export const Reward = (props: RewardProps) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const {
    queryTokenBalance,
    contractWriteRelease,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
    showPreviouslyDistributed,
  } = props;

  if (queryTokenBalance.isLoading) return <Loader scale="component">Loading ERC20 token info...</Loader>;

  if (showPreviouslyDistributed && queryRankRewardsReleased.data === 0) {
    return (
      <li className="no-funds-distributed">
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds distributed
      </li>
    );
  }

  if (showPreviouslyDistributed) {
    return (
      <li className="flex items-center text-positive-11 funds-distributed">
        <section className="flex justify-between w-full animate-appear">
          {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
            <Loader scale="component">Loading info...</Loader>
          )}
          <p className="animate-appear">
            {queryRankRewardsReleased.data} <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
          </p>
        </section>
      </li>
    );
  }

  if (queryRankRewardsReleasable.data === 0) {
    return (
      <li>
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds to distribute
      </li>
    );
  }

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full animate-appear">
        {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
          <Loader scale="component">Loading info...</Loader>
        )}
        <p className="animate-appear">
          {queryRankRewardsReleasable.data} <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>

        {queryRankRewardsReleased.isSuccess && (
          <div data-tooltip-id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
            {queryRankRewardsReleasable.data > 0 && (
              <ButtonV3
                disabled={contestStatus !== ContestStatus.VotingClosed || contractWriteRelease.isLoading}
                size="extraSmall"
                color="bg-gradient-distribute"
                onClick={async () => {
                  toastLoading("distributing rewards...");
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

export default Reward;
