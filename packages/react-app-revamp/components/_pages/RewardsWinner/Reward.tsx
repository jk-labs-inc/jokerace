import Button from "@components/UI/Button";
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
  const {
    chainId,
    queryTokenBalance,
    contractWriteRelease,
    txRelease,
    queryRankRewardsReleasable,
    queryRankRewardsReleased,
  } = props;
  const { chain } = useNetwork();

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
    <section className="animate-appear">
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
        <Loader scale="component">Loading info...</Loader>
      )}
      {queryRankRewardsReleasable.isError && !queryRankRewardsReleasable.data && (
        <>
          <p>Something went wrong and we couldn&apos;t retrieve the amount of available rewards.</p>
          <Button
            onClick={async () => {
              await queryRankRewardsReleasable.refetch();
            }}
            scale="xs"
            intent="neutral-outline"
            className="animate-appear mb-2"
          >
            Try again
          </Button>
        </>
      )}
      {queryRankRewardsReleased.isError && !queryRankRewardsReleased.data && (
        <div className="mb-2">
          <p className="animate-appear">
            Something went wrong and we couldn&apos;t retrieve the amount of sent rewards.
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
        </div>
      )}
      {queryRankRewardsReleasable.data > 0 && parseFloat(queryTokenBalance?.data?.formatted) > 0 && (
        <div className="mb-2">
          <p className="animate-appear">
            waiting to be sent: {queryRankRewardsReleasable.data}{" "}
            <span className="normal-case">{queryTokenBalance?.data?.symbol}</span>
          </p>
        </div>
      )}
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleased?.data > 0 && (
            <p className="animate-appear mb-2">
              Already sent: {queryRankRewardsReleased.data}{" "}
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
              {/* {queryRankRewardsReleasable.data > 0 && contestStatus === CONTEST_STATUS.COMPLETED && (
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
                    : "Send rewards"}
                </Button>
              )} */}
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Reward;
