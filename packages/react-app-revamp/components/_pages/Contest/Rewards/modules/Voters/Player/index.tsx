import { Loader } from "@components/UI/Loader";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useTotalVotesPerUser from "@hooks/useTotalVotesPerUser";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsPlayerNotQualified from "../../shared/PlayerView/NotQualified";
import RewardsNotStarted from "../../shared/PlayerView/RewardsNotStarted";
import RewardsPlayerViewNotConnected from "../../shared/PlayerView/WalletNotConnected";
import VoterClaimRewards from "./components/VoterClaimRewards";
import { ModuleType } from "lib/rewards/types";
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
  const { isConnected, address } = useAccount();
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

  if (!isConnected) {
    return <RewardsPlayerViewNotConnected />;
  }

  if (contestStatus === ContestStatus.ContestOpen || contestStatus === ContestStatus.SubmissionOpen) {
    return <RewardsNotStarted rewardsType={ModuleType.VOTER_REWARDS} />;
  }

  if (isLoadingHasVoted) {
    return <Loader className="mt-8">Loading your voting info...</Loader>;
  }

  // TODO: style this error state
  if (isErrorHasVoted) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-neutral-3">
        <p className="text-[16px] text-neutral-11">failed to load your voting information</p>
        <button
          onClick={() => retryHasVoted()}
          className="px-4 py-2 text-sm font-medium text-neutral-12 bg-neutral-4 hover:bg-neutral-5 rounded-md transition-colors"
        >
          retry
        </button>
      </div>
    );
  }

  const isVotingActive = contestStatus === ContestStatus.VotingOpen;
  const phase = isVotingActive ? "active" : "closed";

  if (!hasVoted) {
    return <RewardsPlayerNotQualified phase={phase} rewardsType={ModuleType.VOTER_REWARDS} />;
  }

  return (
    <div className="max-w-72">
      <VoterClaimRewards
        contestRewardsModuleAddress={contestRewardsModuleAddress}
        rewardsModuleAbi={rewardsModuleAbi}
        chainId={chainId}
        contestStatus={contestStatus}
      />
    </div>
  );
};

export default VoterRewardsPagePlayerView;
