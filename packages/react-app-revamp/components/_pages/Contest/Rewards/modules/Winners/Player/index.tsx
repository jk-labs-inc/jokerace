import Loader from "@components/UI/Loader";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useHasSubmittedProposal from "@hooks/useHasSubmittedProposal";
import { usePayoutAddresses } from "@hooks/usePayoutAddresses";
import { useRewardsStore } from "@hooks/useRewards/store";
import { ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsPlayerNotQualified from "../../shared/PlayerView/NotQualified";
import RewardsNotStarted from "../../shared/PlayerView/RewardsNotStarted";
import RewardsPlayerViewNotConnected from "../../shared/PlayerView/WalletNotConnected";
import WinnerClaimRewards from "./components/WinnerClaimRewards";

interface WinnersRewardsPagePlayerViewProps {
  contestAddress: `0x${string}`;
  chainId: number;
  contestRewardsModuleAddress: `0x${string}`;
  contestAbi: Abi;
  rewardsModuleAbi: Abi;
}

const WinnersRewardsPagePlayerView: FC<WinnersRewardsPagePlayerViewProps> = ({
  contestAddress,
  chainId,
  contestRewardsModuleAddress,
  contestAbi,
  rewardsModuleAbi,
}) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const { address: accountAddress, isConnected } = useAccount();
  const rankings = useRewardsStore(useShallow(state => state.rewards.payees));
  const { hasSubmitted, isLoading, isError, refetch } = useHasSubmittedProposal({
    contractAddress: contestAddress,
    chainId,
    abi: contestAbi,
    address: accountAddress,
  });
  const {
    getRankingsForAddress,
    isLoading: isPayoutAddressesLoading,
    isError: isPayoutAddressesError,
    refetch: refetchPayoutAddresses,
  } = usePayoutAddresses({
    rewardsModuleAddress: contestRewardsModuleAddress,
    abi: rewardsModuleAbi,
    chainId,
    rankings,
  });

  if (!isConnected) {
    return <RewardsPlayerViewNotConnected />;
  }

  if (isLoading || isPayoutAddressesLoading) {
    return <Loader className="mt-8">Loading...</Loader>;
  }

  if (isError || isPayoutAddressesError) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-neutral-3">
        <p className="text-[16px] text-neutral-11">failed to load your rewards information</p>
        <button
          onClick={isError ? () => refetch() : () => refetchPayoutAddresses()}
          className="px-4 py-2 text-sm font-medium text-neutral-12 bg-neutral-4 hover:bg-neutral-5 rounded-md transition-colors"
        >
          retry
        </button>
      </div>
    );
  }

  const rankingsForAddress = accountAddress ? getRankingsForAddress(accountAddress as `0x${string}`) : [];
  const isEntryOpen = contestStatus === ContestStatus.SubmissionOpen;
  const phase = isEntryOpen ? "active" : "closed";

  if (!hasSubmitted) {
    return <RewardsPlayerNotQualified phase={phase} rewardsType={ModuleType.AUTHOR_REWARDS} />;
  }

  if (contestStatus === ContestStatus.ContestOpen || contestStatus === ContestStatus.SubmissionOpen) {
    return <RewardsNotStarted rewardsType={ModuleType.AUTHOR_REWARDS} />;
  }

  return (
    <div className="max-w-72">
      <WinnerClaimRewards
        contestRewardsModuleAddress={contestRewardsModuleAddress}
        rewardsModuleAbi={rewardsModuleAbi}
        chainId={chainId}
        contestStatus={contestStatus}
        rankingsForAddress={rankingsForAddress}
        refetchPayoutAddresses={() => refetchPayoutAddresses()}
      />
    </div>
  );
};

export default WinnersRewardsPagePlayerView;
