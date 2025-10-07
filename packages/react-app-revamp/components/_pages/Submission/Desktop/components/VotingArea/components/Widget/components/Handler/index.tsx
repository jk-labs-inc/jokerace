import { useVotingActions } from "@components/_pages/Submission/hooks/useVotingActions";
import { useVotingSetup } from "@components/_pages/Submission/hooks/useVotingSetup";
import { Charge } from "@hooks/useDeployContest/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FC, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWalletOverlay from "./components/ConnectWalletOverlay";
import VotingContainer from "./components/VotingContainer";

interface SubmissionPageDesktopVotingAreaWidgetHandlerProps {
  charge: Charge;
  votesClose: Date;
}

const SubmissionPageDesktopVotingAreaWidgetHandler: FC<SubmissionPageDesktopVotingAreaWidgetHandlerProps> = ({
  charge,
  votesClose,
}) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const { contestConfig, contestDetails, currentUserAvailableVotesAmount, currentPricePerVote, isVotingOpen } =
    useVotingSetup(votesClose, address);
  const { castVotes, isLoading } = useVotingActions({ charge, votesClose });

  const handleConnectWallet = () => {
    openConnectModal?.();
  };

  return (
    <VotingContainer
      isConnected={isConnected}
      showAddFundsModal={showAddFundsModal}
      chainName={contestConfig.chainName}
      chainNativeCurrencySymbol={contestConfig.chainNativeCurrencySymbol}
      amountOfVotes={currentUserAvailableVotesAmount}
      costToVote={Number(currentPricePerVote)}
      isLoading={isLoading}
      isVotingOpen={isVotingOpen}
      contestState={contestDetails.state ?? 0}
      onGoBack={() => setShowAddFundsModal(false)}
      onAddFunds={() => setShowAddFundsModal(true)}
      onVote={castVotes}
      connectOverlay={<ConnectWalletOverlay onConnect={handleConnectWallet} />}
    />
  );
};

export default SubmissionPageDesktopVotingAreaWidgetHandler;
