import Loader from "@components/UI/Loader";
import { useClaimRewards } from "@hooks/useClaimRewards";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import useUserRewards from "@hooks/useUserRewards";
import { ModuleType } from "lib/rewards";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsPlayerViewClaimRewards from "../../../../shared/PlayerView/ClaimRewards";
import RewardsPlayerLosingStatus from "../../../../shared/PlayerView/LosingStatus";
import RewardsPlayerNotQualified from "../../../../shared/PlayerView/NotQualified";

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
  const rankings = useRewardsStore(useShallow(state => state.rewards.payees));
  const { claimable, claimed, totalRewards, isLoading, refetch } = useUserRewards({
    moduleType: ModuleType.VOTER_REWARDS,
    contractAddress: contestRewardsModuleAddress,
    chainId,
    abi: rewardsModuleAbi,
    voterAddress: userAddress as `0x${string}`,
    rankings,
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
    moduleType: ModuleType.VOTER_REWARDS,
  });

  const handleClaim = async (currency: string, rank: number) => {
    const distribution = claimable?.distributions.find(d => d.rank === rank);
    if (!distribution) return;

    const reward = distribution.rewards.find(r => r.currency.toLowerCase() === currency.toLowerCase());
    if (!reward) return;

    // TODO: access a token address
    const tokenAddress = reward.address || "native";
    const tokenBalance = reward.value;
    const tokenDecimals = reward.decimals;

    await claimRewards(rank, tokenBalance, userAddress as `0x${string}`);
  };

  if (isLoading) {
    return <Loader className="mt-8">Loading...</Loader>;
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
      isClaimLoading={isClaimLoading}
      isClaimSuccess={isClaimSuccess}
    />
  );
};

export default VoterClaimRewards;
