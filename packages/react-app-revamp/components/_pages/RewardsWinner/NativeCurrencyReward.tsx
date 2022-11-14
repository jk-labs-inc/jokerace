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
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "released(uint256)",
    watch: true,
    args: [payee],
    select: data => parseFloat(utils.formatEther(data)).toFixed(4),
  });
  const contractWriteReleaseToken = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release(uint256)",
    args: [payee],
    chainId: chain.id,
    onError(e) {
      toast.error(`${e.cause} ${e.message}`);
    },
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseToken?.data?.hash,
    onError(e) {
      console.error(e);
      toast.error("Something went wrong and the transaction failed :", e?.message);
    },
    onSuccess(data) {
      toast.success("Transaction successful !");
    },
  });

  async function refresh() {
    await queryTokenBalance.refetch();
    await queryRankRewardsReleased.refetch();
    await queryRankRewardsReleasable.refetch();
  }

  if (queryTokenBalance?.isLoading) return <Loader scale="component">Loading native currency info...</Loader>;

  return (
    <section>
      {queryRankRewardsReleased?.data < queryRankRewardsReleasable?.data && <span className="font-medium normal-case">
        wins{" "}
        {((share / 100) * (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))).toFixed(2)}{" "}
        {chain?.nativeCurrency?.symbol}{" "}
      </span>}
      {(queryRankRewardsReleased?.isLoading || queryRankRewardsReleasable?.isLoading) && (
        <Loader scale="component">Loading reward info...</Loader>
      )}

      {queryRankRewardsReleasable.isError && <><p>
        Something went wrong and we couldn&apos;t retrieve the amount of releasable rewards.
      </p>
      <Button
              onClick={async () => {
                await queryRankRewardsReleasable.refetch();
              }}
              scale="xs"
              intent="neutral-outline"
            >
              Try again
            </Button>
      </>
      }

      {queryRankRewardsReleased.isError && <><p>
        Something went wrong and we couldn&apos;t retrieve the amount of released rewards.
      </p>
      <Button
              onClick={async () => {
                await queryRankRewardsReleased.refetch();
              }}
              scale="xs"
              intent="neutral-outline"
            >
              Try again
            </Button>
      </>}

      {queryRankRewardsReleased?.data < queryRankRewardsReleasable.data && (
        <>
          <p>Left to pay: {queryRankRewardsReleasable.data}</p>
        </>
      )}
      {queryRankRewardsReleased?.isSuccess && (
        <>
          {queryRankRewardsReleased?.data > 0 && <p>Paid: {queryRankRewardsReleased?.data}</p>}
          {queryRankRewardsReleased?.data < queryRankRewardsReleasable?.data && (
            <Button
              className="mt-2"
              intent="positive"
              scale="xs"
              isLoading={contractWriteReleaseToken?.isLoading || txRelease?.isLoading ||contractWriteReleaseToken?.isSuccess || txRelease?.isSuccess }
              onClick={async () => await contractWriteReleaseToken.writeAsync()}
            >
              
              {contractWriteReleaseToken?.isError || txRelease?.isError
        ? "Try again"
        : txRelease.isSuccess
        ? `Reward sent successfully`
        : (contractWriteReleaseToken?.isLoading || txRelease?.isLoading)
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
