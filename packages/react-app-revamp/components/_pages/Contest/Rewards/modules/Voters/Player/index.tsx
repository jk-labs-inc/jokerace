import { useAccount } from "wagmi";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useShallow } from "zustand/shallow";
import { FC } from "react";
import useTotalVotesPerUser from "@hooks/useTotalVotesPerUser";
import VoterRewardsPagePlayerViewVotingNotStarted from "./components/VotingNotStarted";
import { Loader } from "@components/UI/Loader";
import RewardsPlayerViewNotConnected from "../../shared/PlayerView/WalletNotConnected";
import { ModuleType } from "lib/rewards";
import RewardsPlayerNotQualified from "../../shared/PlayerView/NotQualified";
import { Abi } from "viem";
import VoterClaimRewards from "./components/VoterClaimRewards";
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
    return <VoterRewardsPagePlayerViewVotingNotStarted />;
  }

  if (isLoadingHasVoted) {
    return <Loader className="mt-8">Loading your voting info...</Loader>;
  }

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
    <div className="flex flex-col gap-4">
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
