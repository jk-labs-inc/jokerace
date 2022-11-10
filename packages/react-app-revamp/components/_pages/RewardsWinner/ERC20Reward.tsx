import Button from "@components/Button";
import Loader from "@components/Loader";
import toast from "react-hot-toast";
import { chain, useBalance, useContractRead, useContractReads, useContractWrite, useNetwork, useToken, useWaitForTransaction } from "wagmi";

export const PayeeERC20Reward = (props: any) => {
  const { payee, tokenAddress, share, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork()
  const queryToken = useToken({
    address: tokenAddress,
  });
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    token: tokenAddress,
  });
  const queryRankRewardsReleasable = useContractRead({
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "releasable",
        args: [tokenAddress, parseInt(`${payee}`)],
      
  })

  const queryRankRewardsReleased = useContractRead({
      addressOrName: contractRewardsModuleAddress,
      contractInterface: abiRewardsModule,
      functionName: "released",
      args: [tokenAddress, parseInt(`${payee}`)],
  })

  const contractWriteReleaseERC20Token = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release",
    args: [tokenAddress, parseInt(`${payee}`)],
    chainId: chain.id
  })

  useWaitForTransaction({
    hash: contractWriteReleaseERC20Token?.data?.hash,
    onError(e) {
      console.error(e)
      toast.error('Something went wrong and the transaction failed :', e?.message)
    },
    async onSuccess(data) {
      await queryRankRewardsReleasable.refetch()
      await queryRankRewardsReleased.refetch()
      toast.success('Transaction successful !')
    }
  })

  if (queryToken?.isLoading || queryTokenBalance.isLoading)
    return <Loader scale="component">Loading ERC20 token info...</Loader>;
  if (queryToken?.isError)
    return (
      <>
        <p>Something went wrong while fetching this token info: {queryToken.error?.message}</p>
        <Button onClick={() => queryToken.refetch()} scale="xs" intent="neutral-outline">
          Try again
        </Button>
      </>
    );
  return (
    <section>
      <span className="font-bold normal-case">
        wins{" "}
        {((share / 100) * (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))).toFixed(2)}{" "}
        {queryToken?.data?.symbol}{" "}
      </span>
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && <Loader scale="component">Loading reward info...</Loader>}
      {(queryRankRewardsReleased.isError || queryRankRewardsReleasable.isError) && (
        <>
          <p>Something went wrong while fetching the reward data.</p>
          <Button onClick={() => {
            queryRankRewardsReleased.refetch()
            queryRankRewardsReleasable.refetch
            }} scale="xs" intent="neutral-outline">
            Try again
          </Button>
        </>
      )}
      {queryRankRewardsReleasable.isSuccess && (
        <>
          <p>Realeasable: {queryRankRewardsReleasable.data}</p>
        </>
      )}
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleased.data === null ? <>
            <Button className="mt-2" intent="positive" scale="xs" onClick={async () => await contractWriteReleaseERC20Token.writeAsync() }>Execute transaction</Button>
          </> : <p>Released: {queryRankRewardsReleased.data }</p>}
        </>
      )}
    </section>
  );
};

export default PayeeERC20Reward;
