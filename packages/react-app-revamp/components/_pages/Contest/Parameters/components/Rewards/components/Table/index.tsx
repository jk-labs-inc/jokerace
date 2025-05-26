import { useSharesByRankings } from "@hooks/useShares";
import { RewardModuleInfo } from "@hooks/useRewards/store";
import { FC } from "react";
import { Abi } from "viem";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";

interface RewardsParametersTableProps {
  rewardsStore: RewardModuleInfo;
  chainId: number;
}

const RewardsParametersTable: FC<RewardsParametersTableProps> = ({ rewardsStore, chainId }) => {
  const { rankShares, isLoading, isError, refetch } = useSharesByRankings({
    rankings: rewardsStore.payees,
    rewardsModuleAddress: rewardsStore.contractAddress as `0x${string}`,
    abi: rewardsStore.abi as Abi,
    chainId,
  });

  //TODO add skeleton loader for table
  if (isLoading) {
    return <div>loading..</div>;
  }

  if (isError) {
    return <div>error..</div>;
  }

  return (
    <div className="flex flex-col space-y-2 w-72">
      {rankShares?.map((data, index) => (
        <div
          key={index}
          className="flex justify-between font-bold items-center pb-2 border-b border-primary-2 text-neutral-9 last:border-b-0"
        >
          <div className="flex items-center text-[16px]">
            <span>{index + 1}</span>
            <sup>{returnOnlySuffix(index + 1)}</sup>
            <span className="ml-2">place</span>
          </div>
          <div className="text-[16px]">{data.share}% of rewards</div>
        </div>
      ))}
    </div>
  );
};

export default RewardsParametersTable;
