import Button from "@components/Button";
import Loader from "@components/Loader";
import { utils } from "ethers";
import toast from "react-hot-toast";
import { useBalance, useContractRead, useContractReads, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";

export const PayeeNativeReward = (props: any) => {
  const { payee, share, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork()
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
  },
  );
  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "releasable(uint256)",
    args: [payee],  
    select: (data) => parseFloat(utils.formatEther(data)).toFixed(4),

  })

  const queryRankRewardsReleased = useContractRead({
      addressOrName: contractRewardsModuleAddress,
      contractInterface: abiRewardsModule,
      functionName: "released(uint256)",
      args: [payee],
      select: (data) => parseFloat(utils.formatEther(data)).toFixed(4),

  })
  const contractWriteRelease = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release(uint256)",
    args: [payee],
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

    if(parseFloat(queryRankRewardsReleasable.data) === 0) return null
  return (
    <section>
      <span className="font-bold normal-case">
        wins{" "}
        {((share / 100) * (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))).toFixed(2)}{" "}
        { chain?.nativeCurrency?.symbol}{" "}
      </span>
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && <Loader scale="component">Loading reward info...</Loader>}
      {queryRankRewardsReleased.isError || queryRankRewardsReleasable.isError && (
        <>
          <p>Something went wrong while fetching reward info: {queryNativeRankRewards.error?.message}</p>
          <Button onClick={() => {
queryRankRewardsReleased.refetch()
queryRankRewardsReleasable.refetch()

          }} scale="xs" intent="neutral-outline">
            Try again
          </Button>
        </>
      )}
       {queryRankRewardsReleasable.isSuccess && (
        <>
          <p>Left to paid: {queryRankRewardsReleasable.data}</p>
        </>
      )}
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleased?.data > 0 && <p>Paid: {queryRankRewardsReleased.data }</p>}
          {queryRankRewardsReleased?.data < queryRankRewardsReleasable.data && <Button className="mt-2" intent="positive" scale="xs" onClick={async () => await contractWriteReleaseERC20Token.writeAsync() }>Execute transaction</Button>}
        </>
      )}
    </section>
  );
};

export default PayeeNativeReward;
