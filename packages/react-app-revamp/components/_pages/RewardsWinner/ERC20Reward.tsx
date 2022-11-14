import Button from "@components/Button";
import Loader from "@components/Loader";
import { utils } from "ethers";
import toast from "react-hot-toast";
import { useBalance, useContractRead, useContractWrite, useNetwork, useToken, useWaitForTransaction } from "wagmi";

export const PayeeERC20Reward = (props: any) => {
  const { payee, tokenAddress, share, contractRewardsModuleAddress, abiRewardsModule } = props;
  const { chain } = useNetwork();
  const queryToken = useToken({
    address: tokenAddress,
  });
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    token: tokenAddress,
    watch: true,
  });
  const queryRankRewardsReleasable = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "releasable(address,uint256)",
    args: [tokenAddress, parseInt(`${payee}`)],
    watch: true,
    select: data => {
      return parseFloat(utils.formatEther(data)).toFixed(4);
    },
    onError(e) {
      console.log(e?.message, e?.cause);
    },
  });

  const queryRankRewardsReleased = useContractRead({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "released(address,uint256)",
    args: [tokenAddress, parseInt(`${payee}`)],
    watch: true,
    select: data => {
      return parseFloat(utils.formatEther(data)).toFixed(4);
    },
    onError(e) {
      console.log(e?.message, e?.cause);
    },
  });

  const contractWriteReleaseERC20Token = useContractWrite({
    addressOrName: contractRewardsModuleAddress,
    contractInterface: abiRewardsModule,
    functionName: "release(address,uint256)",
    args: [tokenAddress, parseInt(`${payee}`)],
    chainId: chain?.id,
  });

  const txRelease = useWaitForTransaction({
    hash: contractWriteReleaseERC20Token?.data?.hash,
    onError(e) {
      console.error(e);
      toast.error("Something went wrong and the transaction failed :", e?.message);
    },
    async onSuccess() {
      await queryTokenBalance.refetch();
      await queryRankRewardsReleased.refetch();
      await queryRankRewardsReleasable.refetch();
      toast.success("Transaction successful !");
    },
  });

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
      <span className="font-medium normal-case">
        wins{" "}
        {((share / 100) * (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))).toFixed(2)}{" "}
        {queryToken?.data?.symbol}{" "}
      </span>
      {(queryRankRewardsReleased.isLoading || queryRankRewardsReleasable.isLoading) && (
        <Loader scale="component">Loading reward info...</Loader>
      )}
      {(queryRankRewardsReleased.isError || queryRankRewardsReleasable.isError) && (
        <>
          <p>Something went wrong while fetching the reward data.</p>
          <Button
            onClick={() => {
              queryRankRewardsReleased.refetch();
              queryRankRewardsReleasable.refetch();
            }}
            scale="xs"
            intent="neutral-outline"
          >
            Try again
          </Button>
        </>
      )}
      {queryRankRewardsReleased?.data < queryRankRewardsReleasable.data && (
        <>
          <p>Left to pay: {queryRankRewardsReleasable.data}</p>
        </>
      )}
      {queryRankRewardsReleased.isSuccess && (
        <>
          {queryRankRewardsReleased?.data > 0 && <p>Paid: {queryRankRewardsReleased.data}</p>}
          {queryRankRewardsReleased?.data < queryRankRewardsReleasable.data && (
           <Button
className="mt-2"
intent="positive"
scale="xs"
isLoading={contractWriteReleaseERC20Token?.isLoading || txRelease?.isLoading ||contractWriteReleaseERC20Token?.isSuccess || txRelease?.isSuccess }
onClick={async () => await contractWriteReleaseERC20Token.writeAsync()}
>

{contractWriteReleaseERC20Token.isError || txRelease.isError
? "Try again"
: txRelease.isSuccess
? `Reward sent successfully`
: (contractWriteReleaseERC20Token.isLoading || txRelease.isLoading)
? "Sending reward..."
: `Execute transaction`}

</Button>
          )}
        </>
      )}
    </section>
  );
};

export default PayeeERC20Reward;
