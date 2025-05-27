import GradientText from "@components/UI/GradientText";
import RefreshButton from "@components/UI/RefreshButton";
import { useContestStore } from "@hooks/useContest/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useSharesByRankings } from "@hooks/useShares";
import { useTotalRewards } from "@hooks/useTotalRewards";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsError from "../Error";
import RewardsCreatorOptions from "./CreatorOptions";
import TotalRewardsTable from "./TotalRewardsTable";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface RewardsCreatorViewProps {
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
  version: string;
}

const TotalRewardsTableSkeleton = ({ payeesCount }: { payeesCount: number }) => (
  <SkeletonTheme baseColor="#6A6A6A" highlightColor="#BB65FF" duration={1}>
    <div className="flex flex-col gap-8">
      <Skeleton width={200} height={24} />

      <div className="flex flex-col gap-2">
        {[...Array(payeesCount)].map((_, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 text-neutral-9 ${index !== payeesCount - 1 ? "border-b border-primary-2 pb-2" : ""}`}
          >
            <div className="flex justify-between items-center text-[16px] font-bold">
              <div>
                <Skeleton width={150} height={16} />
              </div>
              <div>
                <Skeleton width={100} height={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const RewardsCreatorView = ({
  contestRewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
  version,
}: RewardsCreatorViewProps) => {
  const { contestAuthorEthereumAddress, charge } = useContestStore(useShallow(state => state));
  const isEarningsToRewards = charge?.splitFeeDestination.address === contestRewardsModuleAddress;
  const rewardsData = useRewardsStore(useShallow(state => state.rewards));
  const { address: userAddress } = useAccount();
  const isCreator = contestAuthorEthereumAddress === userAddress;
  const {
    data: totalRewards,
    isLoading: isTotalRewardsLoading,
    refetch: refetchTotalRewards,
    isError: isTotalRewardsError,
  } = useTotalRewards({
    rewardsModuleAddress: contestRewardsModuleAddress,
    rewardsModuleAbi,
    chainId,
  });

  const {
    rankShares,
    isLoading: isRankSharesLoading,
    refetch: refetchRankShares,
    isError: isRankSharesError,
  } = useSharesByRankings({
    rewardsModuleAddress: contestRewardsModuleAddress,
    abi: rewardsModuleAbi,
    chainId,
    rankings: rewardsData.payees,
  });

  if (isTotalRewardsError || isRankSharesError) {
    return <RewardsError onRetry={isTotalRewardsError ? refetchTotalRewards : refetchRankShares} />;
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="text-[24px] text-neutral-11">total rewards summary</p>
          <RefreshButton onRefresh={() => refetchTotalRewards()} />
        </div>
        {isCreator && (
          <RewardsCreatorOptions
            rewardsAddress={contestRewardsModuleAddress}
            abi={rewardsModuleAbi}
            chainId={chainId}
            version={version}
          />
        )}
      </div>
      <div className="flex flex-col gap-6">
        {isTotalRewardsLoading || isRankSharesLoading ? (
          <TotalRewardsTableSkeleton payeesCount={rewardsData.payees.length} />
        ) : totalRewards && rankShares ? (
          <TotalRewardsTable
            totalRewards={totalRewards}
            shares={rankShares}
            rewardsModuleType={rewardsData.moduleType}
          />
        ) : null}
        {isEarningsToRewards ? (
          <GradientText textSizeClassName="text-[16px] font-bold" isFontSabo={false}>
            rewards go up as players enter and vote
          </GradientText>
        ) : null}
      </div>
    </div>
  );
};

export default RewardsCreatorView;
