import Button from "@components/Button";
import Loader from "@components/Loader";
import { useBalance, useContractReads, useNetwork } from "wagmi";

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
          <p>Left to pay: {`${queryNativeRankRewards.data?.[0]}` ?? 0}</p>

          <p>Paid: {queryNativeRankRewards.data?.[1] ?? 0}</p>
        </>
      )}
    </section>
  );
};

export default PayeeNativeReward;
