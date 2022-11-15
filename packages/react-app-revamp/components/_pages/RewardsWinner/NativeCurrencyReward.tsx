import Button from "@components/Button";
import Loader from "@components/Loader";
import { utils } from "ethers";
import toast from "react-hot-toast";
import { useBalance, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";

export const PayeeNativeReward = (props: any) => {
  const { payee, share, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork();
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    watch: true,
  });
  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "releasable(uint256)",
    args: [payee],
    watch: true,
    //@ts-ignore
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "released(uint256)",
    watch: true,
    args: [payee],
    //@ts-ignore
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });
  const contractWriteReleaseToken = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release(uint256)",
    args: [payee],
    chainId: chain?.id,
    onError(e) {
      toast.error(`${e.cause} ${e.message}`);
    },
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseToken?.data?.hash,
    onError(e) {
      console.error(e);
      //@ts-ignore
      toast.error("Something went wrong and the transaction failed :", e?.message);
    },
    onSuccess(data) {
      toast.success("Transaction successful !");
    },
  });

  if (queryTokenBalance?.isLoading) return <Loader scale="component">Loading native currency info...</Loader>;

  return (
    <section className="animate-appear">
      <span className="font-bold normal-case animate-appear">
        {queryTokenBalance?.data?.symbol && `${queryTokenBalance?.data?.symbol} reward `}
        {/* @ts-ignore */}
        {queryRankRewardsReleased.data === 0 &&
          `: ${(
            (share / 100) *
            //@ts-ignore
            (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))
          ).toFixed(2)}`}{" "}
      </span>

      {(queryRankRewardsReleased?.isLoading || queryRankRewardsReleasable?.isLoading) && (
        <Loader scale="component">Loading reward info...</Loader>
      )}

      {queryRankRewardsReleasable.isError && (
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
      {queryRankRewardsReleased.isError && (
        <>
          <p>Something went wrong and we couldn&apos;t retrieve the amount of released rewards.</p>
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
      {/* @ts-ignore */}
      {queryRankRewardsReleasable?.data > 0 && (
        <>
          <p className="animate-appear">Left to pay: {queryRankRewardsReleasable.data}</p>
        </>
      )}
      {queryRankRewardsReleased?.isSuccess && (
        <>
          {/* @ts-ignore */}
          {queryRankRewardsReleased?.data > 0 && <p>Paid: {queryRankRewardsReleased?.data}</p>}
          {/* @ts-ignore */}
          {queryRankRewardsReleasable?.data > 0 && (
            <Button
              className="mt-2 animate-appear"
              intent="positive"
              scale="xs"
              isLoading={
                contractWriteReleaseToken?.isLoading ||
                txRelease?.isLoading ||
                contractWriteReleaseToken?.isSuccess ||
                txRelease?.isSuccess
              }
              onClick={async () => await contractWriteReleaseToken.writeAsync()}
            >
              {contractWriteReleaseToken?.isError || txRelease?.isError
                ? "Try again"
                : txRelease.isSuccess
                ? `Reward sent successfully`
                : contractWriteReleaseToken?.isLoading || txRelease?.isLoading
                ? "Sending reward..."
                : `Execute transaction`}
            </Button>
          )}
        </>
      )}
    </section>
  );
};

export default PayeeNativeReward;
