import { useSharesByRankings } from "@hooks/useShares";
import { FC } from "react";
import { Abi } from "viem";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import RewardsError from "@components/_pages/Contest/Rewards/modules/shared/Error";
import { RewardModuleInfo } from "lib/rewards/types";

interface RewardsParametersTableProps {
  rewardsStore: RewardModuleInfo;
  chainId: number;
}

const RewardsTableSkeleton = ({ payeesCount }: { payeesCount: number }) => (
  <SkeletonTheme baseColor="#6A6A6A" highlightColor="#BB65FF" duration={1}>
    <div className="flex flex-col space-y-2 w-72">
      {[...Array(payeesCount)].map((_, index) => (
        <div
          key={index}
          className={`flex flex-col gap-2 text-neutral-9 ${index !== payeesCount - 1 ? "border-b border-primary-2 pb-2" : ""}`}
        >
          <div className="flex items-center text-[16px]">
            <Skeleton width={288} height={16} />
          </div>
        </div>
      ))}
    </div>
  </SkeletonTheme>
);

const RewardsParametersTable: FC<RewardsParametersTableProps> = ({ rewardsStore, chainId }) => {
  const { rankShares, isLoading, isError, refetch } = useSharesByRankings({
    rankings: rewardsStore.payees,
    rewardsModuleAddress: rewardsStore.contractAddress as `0x${string}`,
    abi: rewardsStore.abi as Abi,
    chainId,
  });

  if (isLoading) {
    return <RewardsTableSkeleton payeesCount={rewardsStore.payees.length} />;
  }

  if (isError) {
    return <RewardsError onRetry={refetch} />;
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
