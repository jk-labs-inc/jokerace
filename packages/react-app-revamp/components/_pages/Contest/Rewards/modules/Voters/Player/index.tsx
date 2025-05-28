import { Loader } from "@components/UI/Loader";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useRewardsStore } from "@hooks/useRewards/store";
import useTotalVotesPerUser from "@hooks/useTotalVotesPerUser";
import { useValidateRankings } from "@hooks/useValidateRankings";
import { ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsPlayerNotQualified from "../../shared/PlayerView/NotQualified";
import RewardsNotStarted from "../../shared/PlayerView/RewardsNotStarted";
import RewardsPlayerViewNotConnected from "../../shared/PlayerView/WalletNotConnected";
import VoterClaimRewards from "./components/VoterClaimRewards";
import RewardsError from "../../shared/Error";
interface VoterRewardsPagePlayerViewProps {
  contestAddress: `0x${string}`;
  contestRewardsModuleAddress: `0x${string}`;
  rewardsModuleAbi: Abi;
  chainId: number;
}

const VoterRewardsPagePlayerView: FC<VoterRewardsPagePlayerViewProps> = ({
  contestAddress,
  chainId,
  contestRewardsModuleAddress,
  rewardsModuleAbi,
}) => {
  const rewardsStore = useRewardsStore(useShallow(state => state.rewards));
  const { isConnected, address } = useAccount();
  const isCreator = address === rewardsStore.creator;
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const {
    hasVoted,
    isLoading: isLoadingHasVoted,
    isError: isErrorHasVoted,
    retry: retryHasVoted,
  } = useTotalVotesPerUser({
    contractAddress: contestAddress,
    chainId,
    userAddress: address,
  });
  const {
    tiedRankings,
    isLoading: isLoadingValidateRankings,
    isError: isErrorValidateRankings,
    refetch: retryValidateRankings,
  } = useValidateRankings({
    rankings: rewardsStore.payees,
    contractAddress: contestRewardsModuleAddress,
    chainId,
    abi: rewardsModuleAbi,
  });

  if (!isConnected) {
    return <RewardsPlayerViewNotConnected />;
  }

  if (contestStatus === ContestStatus.ContestOpen || contestStatus === ContestStatus.SubmissionOpen) {
    return <RewardsNotStarted rewardsType={ModuleType.VOTER_REWARDS} />;
  }

  if (isLoadingHasVoted || isLoadingValidateRankings) {
    return <Loader className="mt-8">Loading your voting info...</Loader>;
  }

  if (isErrorHasVoted || isErrorValidateRankings) {
    return <RewardsError onRetry={isErrorHasVoted ? retryHasVoted : retryValidateRankings} />;
  }

  const isVotingActive = contestStatus === ContestStatus.VotingOpen;
  const phase = isVotingActive ? "active" : "closed";

  if (!hasVoted) {
    if (isCreator && tiedRankings.length > 0) {
      return (
        <VoterClaimRewards
          contestRewardsModuleAddress={contestRewardsModuleAddress}
          rewardsModuleAbi={rewardsModuleAbi}
          chainId={chainId}
          contestStatus={contestStatus}
        />
      );
    }

    return <RewardsPlayerNotQualified phase={phase} rewardsType={ModuleType.VOTER_REWARDS} />;
  }

  return (
    <VoterClaimRewards
      contestRewardsModuleAddress={contestRewardsModuleAddress}
      rewardsModuleAbi={rewardsModuleAbi}
      chainId={chainId}
      contestStatus={contestStatus}
    />
  );
};

export default VoterRewardsPagePlayerView;
