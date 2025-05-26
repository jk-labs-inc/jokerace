import Loader from "@components/UI/Loader";
import { useClaimRewards } from "@hooks/useClaimRewards";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useContestStore } from "@hooks/useContest/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import useUserRewards from "@hooks/useUserRewards";
import { ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsPlayerViewClaimRewards from "../../../../shared/PlayerView/ClaimRewards";
import RewardsPlayerLosingStatus from "../../../../shared/PlayerView/LosingStatus";
import RewardsError from "../../../../shared/Error";

interface VoterClaimRewardsProps {
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
  contestStatus: ContestStatus;
}

const VoterClaimRewards: FC<VoterClaimRewardsProps> = ({
  contestRewardsModuleAddress,
  rewardsModuleAbi,
  chainId,
  contestStatus,
}) => {
  const { address: userAddress } = useAccount();
  const { contestAuthorEthereumAddress, version } = useContestStore(state => state);
  const rankings = useRewardsStore(useShallow(state => state.rewards.payees));
  const { claimable, claimed, totalRewards, isLoading, refetch, isError } = useUserRewards({
    moduleType: ModuleType.VOTER_REWARDS,
    contractAddress: contestRewardsModuleAddress,
    chainId,
    abi: rewardsModuleAbi,
    voterAddress: userAddress as `0x${string}`,
    rankings,
    creatorAddress: contestAuthorEthereumAddress as `0x${string}`,
    claimedEnabled: contestStatus === ContestStatus.VotingClosed,
    version,
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
    moduleType: ModuleType.VOTER_REWARDS,
  });

  const handleClaim = async (rank: number, value: bigint, tokenAddress: string) => {
    await claimRewards(rank, value, tokenAddress, userAddress);
  };

  if (isLoading) {
    return <Loader className="mt-8">Loading...</Loader>;
  }

  if (isError) {
    return <RewardsError onRetry={refetch} />;
  }

  if (contestStatus === ContestStatus.VotingOpen && !totalRewards.length) {
    return <RewardsPlayerLosingStatus phase="active" rewardsType={ModuleType.VOTER_REWARDS} />;
  }

  if (contestStatus === ContestStatus.VotingClosed && !totalRewards.length) {
    return <RewardsPlayerLosingStatus phase="closed" rewardsType={ModuleType.VOTER_REWARDS} />;
  }

  return (
    <RewardsPlayerViewClaimRewards
      totalRewards={totalRewards || []}
      claimableDistributions={claimable?.distributions || []}
      claimedDistributions={claimed?.distributions || []}
      contestStatus={contestStatus}
      onRefresh={refetch}
      onClaim={handleClaim}
      isClaimLoading={(rank: number, tokenAddress: string) => isClaimLoading(rank, tokenAddress)}
      isClaimSuccess={(rank: number, tokenAddress: string) => isClaimSuccess(rank, tokenAddress)}
      isAdditionalStatisticsSupported
    />
  );
};

export default VoterClaimRewards;
