import GradientText from "@components/UI/GradientText";
import RefreshButton from "@components/UI/RefreshButton";
import { useContestStore } from "@hooks/useContest/store";
import { RewardModuleInfo } from "lib/rewards/types";
import { useSharesByRankings } from "@hooks/useShares";
import { useTotalRewards } from "@hooks/useTotalRewards";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useConnection } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsError from "../Error";
import RewardsCreatorOptions from "./CreatorOptions";
import TotalRewardsTable from "./TotalRewardsTable";

interface RewardsCreatorViewProps {
  rewards: RewardModuleInfo;
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
            className={`flex flex-col gap-2 text-neutral-9 ${
              index !== payeesCount - 1 ? "border-b border-primary-2 pb-2" : ""
            }`}
          >
            <div className="flex justify-between items-center text-[16px] font-bold">
              <Skeleton width={150} height={16} />
              <Skeleton width={100} height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

const RewardsCreatorView = ({ rewards, chainId, version }: RewardsCreatorViewProps) => {
  const { contestAuthorEthereumAddress, charge } = useContestStore(useShallow(state => state));
  const { address: userAddress } = useConnection();
  const isCreator = contestAuthorEthereumAddress === userAddress;
  const {
    data: totalRewards,
    isLoading: isTotalRewardsLoading,
    refetch: refetchTotalRewards,
    isError: isTotalRewardsError,
  } = useTotalRewards({
    rewardsModuleAddress: rewards.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards.abi,
    chainId,
  });

  const {
    rankShares,
    isLoading: isRankSharesLoading,
    refetch: refetchRankShares,
    isError: isRankSharesError,
  } = useSharesByRankings({
    rewardsModuleAddress: rewards.contractAddress as `0x${string}`,
    abi: rewards.abi,
    chainId,
    rankings: rewards.payees ?? [],
  });

  if (isTotalRewardsError || isRankSharesError) {
    return <RewardsError onRetry={isTotalRewardsError ? refetchTotalRewards : refetchRankShares} />;
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="text-[24px] text-neutral-11">total rewards summary</p>
          <RefreshButton onRefresh={() => refetchTotalRewards()} />
        </div>
        {isCreator && (
          <RewardsCreatorOptions
            rewardsAddress={rewards.contractAddress as `0x${string}`}
            abi={rewards.abi}
            chainId={chainId}
            version={version}
          />
        )}
      </div>
      <div className="flex flex-col gap-6">
        {isTotalRewardsLoading || isRankSharesLoading ? (
          <TotalRewardsTableSkeleton payeesCount={rewards.payees.length} />
        ) : totalRewards && rankShares ? (
          <TotalRewardsTable totalRewards={totalRewards} shares={rankShares} />
        ) : null}
        <GradientText textSizeClassName="text-[16px] font-bold" isFontSabo={false}>
          rewards go up as players enter and vote
        </GradientText>
      </div>
    </div>
  );
};

export default RewardsCreatorView;
