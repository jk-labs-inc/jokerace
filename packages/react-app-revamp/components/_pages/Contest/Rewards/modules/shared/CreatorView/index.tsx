import { useContestStore } from "@hooks/useContest/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import { useSharesByRankings } from "@hooks/useShares";
import { useTotalRewards } from "@hooks/useTotalRewards";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsCreatorOptions from "./CreatorOptions";
import TotalRewardsTable from "./TotalRewardsTable";
import RefreshButton from "@components/UI/RefreshButton";
import GradientText from "@components/UI/GradientText";

interface RewardsCreatorViewProps {
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
  version: string;
}

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
  } = useTotalRewards({
    rewardsModuleAddress: contestRewardsModuleAddress,
    rewardsModuleAbi,
    chainId,
  });

  const {
    rankShares,
    isLoading: isRankSharesLoading,
    refetch: refetchRankShares,
  } = useSharesByRankings({
    rewardsModuleAddress: contestRewardsModuleAddress,
    abi: rewardsModuleAbi,
    chainId,
    rankings: rewardsData.payees,
  });

  return (
    <div className="flex flex-col gap-12">
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
      {/* TODO: Add a loading state */}
      <div className="flex flex-col gap-6">
        {totalRewards && rankShares && <TotalRewardsTable totalRewards={totalRewards} shares={rankShares} />}
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
