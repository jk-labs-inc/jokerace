import Button from "@components/Button";
import Loader from "@components/Loader";
import toast from "react-hot-toast";
import { useBalance, useContractReads, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";

export const PayeeNativeReward = (props: any) => {
  const { payee, share, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork()
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
  },
  );
  const queryNativeRankRewards = useContractReads({
    contracts: [
      {
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "releasable",
        args: [parseInt(`${payee}`)],
      },
      {
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "released",
        args: [parseInt(`${payee}`)],
      },
    ],
  });

  const contractWriteRelease = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release",
    args: [parseInt(`${payee}`)],
    chainId: chain.id,
    onError(e) {
      toast.error(`${e.cause} ${e.message}`)
    },
  })

  useWaitForTransaction({
    hash: contractWriteRelease?.data?.hash,
    onError(e) {
      console.error(e)
      toast.error('Something went wrong and the transaction failed :', e?.message)
    },
    async onSuccess(data) {
      toast.success('Transaction successful !')
    }
  })

  if (queryTokenBalance.isLoading)
    return <Loader scale="component">Loading native currency info...</Loader>;

  return (
    <section>
      <span className="font-bold normal-case">
        wins{" "}
        {((share / 100) * (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))).toFixed(2)}{" "}
        { chain?.nativeCurrency?.symbol}{" "}
      </span>
      {queryNativeRankRewards.isLoading && <Loader scale="component">Loading reward info...</Loader>}
      {queryNativeRankRewards.isError && (
        <>
          <p>Something went wrong while fetching reward info: {queryNativeRankRewards.error?.message}</p>
          <Button onClick={() => queryNativeRankRewards.refetch()} scale="xs" intent="neutral-outline">
            Try again
          </Button>
        </>
      )}
      {queryNativeRankRewards.isSuccess && (
        <>
          <p>Left to pay: {`${queryNativeRankRewards.data?.[0]}`}</p>

          <p>Paid: {queryNativeRankRewards.data?.[1]}</p>

          <Button className="mt-2" intent="positive" scale="xs" onClick={async () => await contractWriteRelease.writeAsync() }>Execute transaction</Button>

        </>
      )}
    </section>
  );
};

export default PayeeNativeReward;
