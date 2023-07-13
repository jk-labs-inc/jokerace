import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import { toastLoading } from "@components/UI/Toast";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";

interface RewardProps {
  share: any;
  chainId: number;
  queryTokenBalance: any;
  contractWriteRelease: any;
  txRelease: any;
  queryRankRewardsReleasable: any;
  queryRankRewardsReleased: any;
}

export const Reward = (props: RewardProps) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const { queryTokenBalance, contractWriteRelease, queryRankRewardsReleasable, queryRankRewardsReleased } = props;

  if (queryTokenBalance.isLoading) return <Loader scale="component">Loading ERC20 token info...</Loader>;

  return (
    <section className="flex justify-between animate-appear">
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
        <Loader scale="component">Loading info...</Loader>
      )}
      <div className="mb-2">
        <p className="animate-appear">
          {queryRankRewardsReleasable.data} <span className="normal-case">${queryTokenBalance?.data?.symbol}</span>
        </p>
      </div>
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleasable.data && (
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
        </>
      )}
    </section>
  );
};

export default Reward;
