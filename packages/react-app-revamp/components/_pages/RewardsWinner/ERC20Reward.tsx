import Button from "@components/Button";
import Loader from "@components/Loader";
import { useBalance, useContractReads, useToken } from "wagmi";

export const PayeeERC20Reward = (props: any) => {
  const { payee, tokenAddress, share, contractRewardsModuleAddress, abiRewardsModule } = props;
  const queryToken = useToken({
    address: tokenAddress,
  });
  const queryTokenBalance = useBalance({
    addressOrName: contractRewardsModuleAddress,
    token: tokenAddress,
  });
  const queryRankRewards = useContractReads({
    contracts: [
      {
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "releasable",
        args: [tokenAddress, parseInt(`${payee}`)],
      },
      {
        addressOrName: contractRewardsModuleAddress,
        contractInterface: abiRewardsModule,
        functionName: "released",
        args: [tokenAddress, parseInt(`${payee}`)],
      },
    ],
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
      <span className="font-bold normal-case">
        wins{" "}
        {((share / 100) * (queryTokenBalance.data?.value / Math.pow(10, queryTokenBalance.data?.decimals))).toFixed(2)}{" "}
        {queryToken?.data?.symbol}{" "}
      </span>
      {queryRankRewards.isLoading && <Loader scale="component">Loading reward info...</Loader>}
      {queryRankRewards.isError && (
        <>
          <p>Something went wrong while fetching reward info: {queryRankRewards.error?.message}</p>
          <Button onClick={() => queryRankRewards.refetch()} scale="xs" intent="neutral-outline">
            Try again
          </Button>
        </>
      )}
      {queryRankRewards.isSuccess && (
        <>
          <p>Released: {queryRankRewards.data?.[1]}</p>
          <p>Realeasable: {`${queryRankRewards.data?.[0]}`}</p>
        </>
      )}
    </section>
  );
};

export default PayeeERC20Reward;
