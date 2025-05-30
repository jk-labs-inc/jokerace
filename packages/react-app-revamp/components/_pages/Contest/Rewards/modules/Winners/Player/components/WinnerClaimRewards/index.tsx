import Loader from "@components/UI/Loader";
import { useClaimRewards } from "@hooks/useClaimRewards";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import useUserRewards from "@hooks/useUserRewards";
import { ModuleType, RewardModuleInfo } from "lib/rewards/types";
import { FC } from "react";
import { useAccount } from "wagmi";
import RewardsError from "../../../../shared/Error";
import RewardsPlayerViewClaimRewards from "../../../../shared/PlayerView/ClaimRewards";
import RewardsPlayerLosingStatus from "../../../../shared/PlayerView/LosingStatus";
interface WinnerClaimRewardsProps {
  rewards: RewardModuleInfo;
  chainId: number;
  contestStatus: ContestStatus;
  rankingsForAddress: number[];
  refetchPayoutAddresses: () => Promise<any>;
}

const WinnerClaimRewards: FC<WinnerClaimRewardsProps> = ({
  rewards,
  chainId,
  contestStatus,
  rankingsForAddress,
  refetchPayoutAddresses,
}) => {
  const { address: userAddress } = useAccount();
  const { contestAuthorEthereumAddress, version } = useContestStore(state => state);
  const {
    claimable,
    claimed,
    totalRewards,
    isLoading,
    isError: isUserRewardsError,
    refetch: refetchUserRewards,
  } = useUserRewards({
    moduleType: ModuleType.AUTHOR_REWARDS,
    contractAddress: rewards.contractAddress as `0x${string}`,
    chainId,
    abi: rewards.abi,
    userAddress: userAddress as `0x${string}`,
    rankings: rankingsForAddress,
    creatorAddress: contestAuthorEthereumAddress as `0x${string}`,
    version,
    claimedEnabled: contestStatus === ContestStatus.VotingClosed,
  });

  const {
    claimRewards,
    isLoading: isClaimLoading,
    isSuccess: isClaimSuccess,
  } = useClaimRewards({
    contractRewardsModuleAddress: rewards.contractAddress as `0x${string}`,
    abiRewardsModule: rewards.abi,
    chainId,
    tokenAddress: "native",
    tokenDecimals: 18,
    moduleType: ModuleType.AUTHOR_REWARDS,
    userAddress: userAddress as `0x${string}`,
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

  if (isUserRewardsError) {
    return <RewardsError onRetry={refetchUserRewards} />;
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
      isClaimLoading={(rank: number, tokenAddress: string) => isClaimLoading(rank, tokenAddress)}
      isClaimSuccess={(rank: number, tokenAddress: string) => isClaimSuccess(rank, tokenAddress)}
    />
  );
};

export default WinnerClaimRewards;
