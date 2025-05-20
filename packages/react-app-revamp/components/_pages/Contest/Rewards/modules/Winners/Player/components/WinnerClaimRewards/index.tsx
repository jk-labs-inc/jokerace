import Loader from "@components/UI/Loader";
import { useClaimRewards } from "@hooks/useClaimRewards";
import { ContestStatus } from "@hooks/useContestStatus/store";
import useUserRewards from "@hooks/useUserRewards";
import { ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import RewardsPlayerViewClaimRewards from "../../../../shared/PlayerView/ClaimRewards";
import RewardsPlayerLosingStatus from "../../../../shared/PlayerView/LosingStatus";

interface WinnerClaimRewardsProps {
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
  contestStatus: ContestStatus;
  rankingsForAddress: number[];
  refetchPayoutAddresses: () => Promise<any>;
}

const WinnerClaimRewards: FC<WinnerClaimRewardsProps> = ({
  contestRewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
  contestStatus,
  rankingsForAddress,
  refetchPayoutAddresses,
}) => {
  const { address: userAddress } = useAccount();
  const {
    claimable,
    claimed,
    totalRewards,
    isLoading,
    refetch: refetchUserRewards,
  } = useUserRewards({
    moduleType: ModuleType.AUTHOR_REWARDS,
    contractAddress: contestRewardsModuleAddress,
    chainId,
    abi: rewardsModuleAbi,
    voterAddress: userAddress as `0x${string}`,
    rankings: rankingsForAddress,
    claimedEnabled: contestStatus === ContestStatus.VotingClosed,
  });

  const {
    claimRewards,
    isLoading: isClaimLoading,
    isSuccess: isClaimSuccess,
  } = useClaimRewards({
    contractRewardsModuleAddress: contestRewardsModuleAddress,
    abiRewardsModule: rewardsModuleAbi,
    chainId,
    tokenAddress: "native",
    tokenDecimals: 18,
    moduleType: ModuleType.AUTHOR_REWARDS,
  });

  const handleRefresh = async () => {
    await refetchPayoutAddresses();
    refetchUserRewards();
  };

  const handleClaim = async (rank: number, value: bigint, tokenAddress: string) => {
    await claimRewards(rank, value, tokenAddress);
  };

  if (isLoading) {
    return <Loader className="mt-8">Loading...</Loader>;
  }

  if (contestStatus === ContestStatus.VotingOpen && !totalRewards.length) {
    return <RewardsPlayerLosingStatus phase="active" rewardsType={ModuleType.AUTHOR_REWARDS} />;
  }

  if (contestStatus === ContestStatus.VotingClosed && !totalRewards.length) {
    return <RewardsPlayerLosingStatus phase="closed" rewardsType={ModuleType.AUTHOR_REWARDS} />;
  }

  return (
    <RewardsPlayerViewClaimRewards
      totalRewards={totalRewards || []}
      claimableDistributions={claimable?.distributions || []}
      claimedDistributions={claimed?.distributions || []}
      contestStatus={contestStatus}
      onRefresh={handleRefresh}
      onClaim={handleClaim}
      isClaimLoading={isClaimLoading}
      isClaimSuccess={isClaimSuccess}
    />
  );
};

export default WinnerClaimRewards;
