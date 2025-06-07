import Loader from "@components/UI/Loader";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useHasSubmittedProposal from "@hooks/useHasSubmittedProposal";
import { usePayoutAddresses } from "@hooks/usePayoutAddresses";
import { RewardModuleInfo, ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import RewardsError from "../../shared/Error";
import RewardsPlayerNotQualified from "../../shared/PlayerView/NotQualified";
import RewardsNotStarted from "../../shared/PlayerView/RewardsNotStarted";
import RewardsPlayerViewNotConnected from "../../shared/PlayerView/WalletNotConnected";
import WinnerClaimRewards from "./components/WinnerClaimRewards";
import { useValidateRankings } from "@hooks/useValidateRankings";
interface WinnersRewardsPagePlayerViewProps {
  rewards: RewardModuleInfo;
  contestAddress: `0x${string}`;
  chainId: number;
  contestAbi: Abi;
}

const WinnersRewardsPagePlayerView: FC<WinnersRewardsPagePlayerViewProps> = ({
  rewards,
  contestAddress,
  chainId,
  contestAbi,
}) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const { address: accountAddress, isConnected } = useAccount();
  const creator = useContestStore(useShallow(state => state.contestAuthorEthereumAddress));
  const isCreator = accountAddress === creator;
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
    rewardsModuleAddress: rewards.contractAddress as `0x${string}`,
    abi: rewards.abi,
    chainId,
    rankings: rewards.payees,
  });
  const rankingsForAddress = accountAddress ? getRankingsForAddress(accountAddress as `0x${string}`) : [];
  const isEntryOpen = contestStatus === ContestStatus.SubmissionOpen;
  const phase = isEntryOpen ? "active" : "closed";

  if (!isConnected) {
    return <RewardsPlayerViewNotConnected />;
  }

  if (isLoadingHasSubmittedProposal || isPayoutAddressesLoading || isLoadingValidateRankings) {
    return <Loader className="mt-8">Loading...</Loader>;
  }

  if (isErrorHasSubmittedProposal || isPayoutAddressesError || isErrorValidateRankings) {
    return (
      <RewardsError onRetry={isErrorHasSubmittedProposal ? refetchHasSubmittedProposal : isErrorValidateRankings ? retryValidateRankings : refetchPayoutAddresses} />
    );
  }

  if (!hasSubmitted) {
    if (isCreator && rankingsForAddress.length > 0) {
      return (
        <WinnerClaimRewards
          rewards={rewards}
          chainId={chainId}
          contestAddress={contestAddress}
          contestAbi={contestAbi}
          contestStatus={contestStatus}
          rankingsForAddress={rankingsForAddress}
          tiedRankings={tiedRankings}
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
      rewards={rewards}
      chainId={chainId}
      contestAddress={contestAddress}
      contestAbi={contestAbi}
      contestStatus={contestStatus}
      rankingsForAddress={rankingsForAddress}
      tiedRankings={tiedRankings}
      refetchPayoutAddresses={() => refetchPayoutAddresses()}
    />
  );
};

export default WinnersRewardsPagePlayerView;
