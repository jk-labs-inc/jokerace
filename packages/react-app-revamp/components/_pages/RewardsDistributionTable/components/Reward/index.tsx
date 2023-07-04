import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import { useContestStore } from "@hooks/useContest/store";
import { useNetwork } from "wagmi";

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
  const { queryTokenBalance, contractWriteRelease, queryRankRewardsReleasable, queryRankRewardsReleased } = props;

  if (queryTokenBalance.isLoading) return <Loader scale="component">Loading ERC20 token info...</Loader>;
  if (queryTokenBalance?.isError)
    return (
      <div className="mb-2">
        <p>Something went wrong while fetching this token info: {queryTokenBalance.error?.message}</p>
        <Button onClick={async () => await queryTokenBalance.refetch()} scale="xs" intent="neutral-outline">
          Try again
        </Button>
      </div>
    );

  return (
    <section className="flex justify-between animate-appear">
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
        <Loader scale="component">Loading info...</Loader>
      )}
      {queryRankRewardsReleasable.isError && !queryRankRewardsReleasable.data && (
        <>
          <p>Something went wrong and we couldn&apos;t retrieve the amount of available rewards.</p>
          <ButtonV3
            onClick={async () => {
              await queryRankRewardsReleasable.refetch();
            }}
            size="extraSmall"
            color="bg-gradient-distribute"
          >
            Try again
          </ButtonV3>
        </>
      )}
      {queryRankRewardsReleased.isError && !queryRankRewardsReleased.data && (
        <div className="mb-2">
          <p className="animate-appear">
            Something went wrong and we couldn&apos;t retrieve the amount of sent rewards.
          </p>
          <ButtonV3
            onClick={async () => {
              await queryRankRewardsReleasable.refetch();
            }}
            size="extraSmall"
            color="bg-gradient-distribute"
          >
            Try again
          </ButtonV3>
        </div>
      )}
      <div className="mb-2">
        <p className="animate-appear">
          {queryRankRewardsReleasable.data} <span className="normal-case">${queryTokenBalance?.data?.symbol}</span>
        </p>
      </div>
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleasable.data > 0 && (
            <ButtonV3
              size="extraSmall"
              color="bg-gradient-distribute"
              onClick={async () => await contractWriteRelease.writeAsync()}
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
