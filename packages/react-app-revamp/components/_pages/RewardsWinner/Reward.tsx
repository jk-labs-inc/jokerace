import shallow from "zustand/shallow";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import Button from "@components/Button";
import Loader from "@components/Loader";
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
  const {
    share,
    chainId,
    queryTokenBalance,
    contractWriteRelease,
    txRelease,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
  } = props;
  const { chain } = useNetwork();
  const { contestStatus } = useStoreContest(
    state => ({
      //@ts-ignore
      contestStatus: state.contestStatus,
    }),
    shallow,
  );

  if (queryTokenBalance.isLoading) return <Loader scale="component">Loading ERC20 token info...</Loader>;
  if (queryTokenBalance?.isError)
    return (
      <>
        <p>Something went wrong while fetching this token info: {queryTokenBalance.error?.message}</p>
        <Button onClick={async () => await queryTokenBalance.refetch()} scale="xs" intent="neutral-outline">
          Try again
        </Button>
      </>
    );

  return (
    <section className="animate-appear pb-4">
      <span className="font-bold normal-case animate-appear">
        {queryTokenBalance?.data?.symbol && `Wins ${queryTokenBalance?.data?.symbol}`}
      </span>
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
        <Loader scale="component">Loadinginfo...</Loader>
      )}
      {queryRankRewardsReleasable.isError && !queryRankRewardsReleasable.data && (
        <>
          <p>Something went wrong and we couldn&apos;t retrieve the amount of releasable rewards.</p>
          <Button
            onClick={async () => {
              await queryRankRewardsReleasable.refetch();
            }}
            scale="xs"
            intent="neutral-outline"
            className="animate-appear"
          >
            Try again
          </Button>
        </>
      )}
      {queryRankRewardsReleased.isError && !queryRankRewardsReleased.data && (
        <>
          <p className="animate-appear">
            Something went wrong and we couldn&apos;t retrieve the amount of released rewards.
          </p>
          <Button
            onClick={async () => {
              await queryRankRewardsReleased.refetch();
            }}
            className="animate-appear"
            scale="xs"
            intent="neutral-outline"
          >
            Try again
          </Button>
        </>
      )}
      {queryRankRewardsReleasable.data > 0 && parseFloat(queryTokenBalance?.data?.formatted) > 0 && (
        <>
          <p className="animate-appear">
            Can receive {queryRankRewardsReleasable.data}{" "}
            <span className="normal-case">{queryTokenBalance?.data?.symbol}</span>
          </p>
        </>
      )}
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleased?.data > 0 && (
            <p className="animate-appear">
              Already received: {queryRankRewardsReleased.data}{" "}
              <span className="normal-case">{queryTokenBalance?.data?.symbol}</span>
            </p>
          )}
          {parseFloat(queryTokenBalance?.data?.formatted) === 0 ? (
            <>
              <p className="italic text-xs text-neutral-11 animate-appear">
                No <span className="normal-case">{queryTokenBalance?.data?.symbol}</span> available to be sent to this
                winner
              </p>
            </>
          ) : (
            <>
              {queryRankRewardsReleasable.data > 0 && contestStatus === CONTEST_STATUS.COMPLETED && (
                <Button
                  className="mt-2 animate-appear"
                  intent="positive"
                  scale="xs"
                  disabled={chain?.id !== chainId}
                  isLoading={contractWriteRelease?.isLoading || txRelease?.isLoading}
                  onClick={async () => await contractWriteRelease.writeAsync()}
                >
                  {contractWriteRelease.isError || txRelease.isError
                    ? "Try again"
                    : contractWriteRelease.isLoading || txRelease.isLoading
                    ? "Sending reward..."
                    : `Execute transaction`}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Reward;
