import Loader from "@components/UI/Loader";
import { useClaimRewards } from "@hooks/useClaimRewards";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { RewardModuleInfo, ModuleType } from "lib/rewards/types";
import useUserRewards from "@hooks/useUserRewards";
import { FC } from "react";
import { useAccount } from "wagmi";
import RewardsError from "../../../../shared/Error";
import RewardsPlayerViewClaimRewards from "../../../../shared/PlayerView/ClaimRewards";
import RewardsPlayerLosingStatus from "../../../../shared/PlayerView/LosingStatus";
import { useUserTiedRankings } from "@hooks/useUserTiedRankings";
import RewardsPlayerTiedStatus from "../../../../shared/PlayerView/TiedStatus";

interface VoterClaimRewardsProps {
  rewards: RewardModuleInfo;
  chainId: number;
  contestStatus: ContestStatus;
  contestAddress: `0x${string}`;
  tiedRankings: number[];
}

const VoterClaimRewards: FC<VoterClaimRewardsProps> = ({
  rewards,
  chainId,
  contestStatus,
  contestAddress,
  tiedRankings,
}) => {
  const { address: userAddress } = useAccount();
  const { contestAuthorEthereumAddress, version, contestAbi } = useContestStore(state => state);
  const isCreator = userAddress === contestAuthorEthereumAddress;
  const {
    data: userTiedRankings = [],
    isLoading: isTiedRankingsLoading,
    isError: isTiedRankingsError,
  } = useUserTiedRankings({
    tiedRankings,
    contestAddress,
    chainId,
    contestAbi,
    userAddress: userAddress as `0x${string}`,
    version,
    moduleType: ModuleType.VOTER_REWARDS,
    enabled: tiedRankings.length > 0 && !!userAddress && !isCreator,
  });

  const {
    claimable,
    claimed,
    totalRewards,
    isLoading: isUserRewardsLoading,
    refetch,
    isError: isUserRewardsError,
  } = useUserRewards({
    moduleType: ModuleType.VOTER_REWARDS,
    contractAddress: rewards.contractAddress as `0x${string}`,
    chainId,
    abi: rewards.abi,
    userAddress: userAddress as `0x${string}`,
    rankings: rewards.payees,
    creatorAddress: contestAuthorEthereumAddress as `0x${string}`,
    claimedEnabled: contestStatus === ContestStatus.VotingClosed,
    version,
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
    moduleType: ModuleType.VOTER_REWARDS,
    userAddress: userAddress as `0x${string}`,
  });

  const handleClaim = async (rank: number, value: bigint, tokenAddress: string) => {
    await claimRewards(rank, value, tokenAddress, userAddress);
  };

  if (isUserRewardsLoading || isTiedRankingsLoading) {
    return <Loader className="mt-8">Loading...</Loader>;
  }

  if (isUserRewardsError || isTiedRankingsError) {
    return <RewardsError onRetry={refetch} />;
  }

  if (userTiedRankings.length > 0 && !totalRewards.length) {
    return <RewardsPlayerTiedStatus phase={contestStatus === ContestStatus.VotingOpen ? "active" : "closed"} />;
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
      userTiedRankings={userTiedRankings}
      isAdditionalStatisticsSupported
    />
  );
};

export default VoterClaimRewards;
