import { Loader } from "@components/UI/Loader";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useTotalVotesPerUser from "@hooks/useTotalVotesPerUser";
import { useValidateRankings } from "@hooks/useValidateRankings";
import { RewardModuleInfo } from "lib/rewards/types";
import { FC } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsError from "../../shared/Error";
import RewardsPlayerNotQualified from "../../shared/PlayerView/NotQualified";
import RewardsNotStarted from "../../shared/PlayerView/RewardsNotStarted";
import RewardsPlayerViewNotConnected from "../../shared/PlayerView/WalletNotConnected";
import VoterClaimRewards from "./components/VoterClaimRewards";

interface VoterRewardsPagePlayerViewProps {
  contestAddress: `0x${string}`;
  chainId: number;
  rewards: RewardModuleInfo;
}

const VoterRewardsPagePlayerView: FC<VoterRewardsPagePlayerViewProps> = ({ contestAddress, chainId, rewards }) => {
  const { isConnected, address } = useAccount();
  const isCreator = address === rewards.creator;
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
    rankings: rewards.payees,
    contractAddress: rewards.contractAddress as `0x${string}`,
    chainId,
    abi: rewards.abi,
  });

  if (!isConnected) {
    return <RewardsPlayerViewNotConnected />;
  }

  if (contestStatus === ContestStatus.ContestOpen || contestStatus === ContestStatus.SubmissionOpen) {
    return <RewardsNotStarted />;
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
          rewards={rewards}
          chainId={chainId}
          contestStatus={contestStatus}
          contestAddress={contestAddress}
          tiedRankings={tiedRankings}
        />
      );
    }

    return <RewardsPlayerNotQualified phase={phase} />;
  }

  return (
    <VoterClaimRewards
      rewards={rewards}
      chainId={chainId}
      contestStatus={contestStatus}
      contestAddress={contestAddress}
      tiedRankings={tiedRankings}
    />
  );
};

export default VoterRewardsPagePlayerView;
