import Loader from "@components/UI/Loader";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useHasSubmittedProposal from "@hooks/useHasSubmittedProposal";
import { usePayoutAddresses } from "@hooks/usePayoutAddresses";
import { useRewardsStore } from "@hooks/useRewards/store";
import { ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsError from "../../shared/Error";
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
  const creator = useContestStore(useShallow(state => state.contestAuthorEthereumAddress));
  const isCreator = accountAddress === creator;
  const rankings = useRewardsStore(useShallow(state => state.rewards.payees));
  const {
    hasSubmitted,
    isLoading: isLoadingHasSubmittedProposal,
    isError: isErrorHasSubmittedProposal,
    refetch: refetchHasSubmittedProposal,
  } = useHasSubmittedProposal({
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
  const rankingsForAddress = accountAddress ? getRankingsForAddress(accountAddress as `0x${string}`) : [];
  const isEntryOpen = contestStatus === ContestStatus.SubmissionOpen;
  const phase = isEntryOpen ? "active" : "closed";

  if (!isConnected) {
    return <RewardsPlayerViewNotConnected />;
  }

  if (isLoadingHasSubmittedProposal || isPayoutAddressesLoading) {
    return <Loader className="mt-8">Loading...</Loader>;
  }

  if (isErrorHasSubmittedProposal || isPayoutAddressesError) {
    return (
      <RewardsError onRetry={isErrorHasSubmittedProposal ? refetchHasSubmittedProposal : refetchPayoutAddresses} />
    );
  }

  if (!hasSubmitted) {
    if (isCreator && rankingsForAddress.length > 0) {
      return (
        <WinnerClaimRewards
          contestRewardsModuleAddress={contestRewardsModuleAddress}
          rewardsModuleAbi={rewardsModuleAbi}
          chainId={chainId}
          contestStatus={contestStatus}
          rankingsForAddress={rankingsForAddress}
          refetchPayoutAddresses={() => refetchPayoutAddresses()}
        />
      );
    }

    return <RewardsPlayerNotQualified phase={phase} rewardsType={ModuleType.AUTHOR_REWARDS} />;
  }

  if (contestStatus === ContestStatus.ContestOpen || contestStatus === ContestStatus.SubmissionOpen) {
    return <RewardsNotStarted rewardsType={ModuleType.AUTHOR_REWARDS} />;
  }

  return (
    <WinnerClaimRewards
      contestRewardsModuleAddress={contestRewardsModuleAddress}
      rewardsModuleAbi={rewardsModuleAbi}
      chainId={chainId}
      contestStatus={contestStatus}
      rankingsForAddress={rankingsForAddress}
      refetchPayoutAddresses={() => refetchPayoutAddresses()}
    />
  );
};

export default WinnersRewardsPagePlayerView;
