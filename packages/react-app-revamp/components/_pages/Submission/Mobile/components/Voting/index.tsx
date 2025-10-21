import { useVotingActions } from "@components/_pages/Submission/hooks/useVotingActions";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { FC, useState } from "react";
import MobileVotingDrawer from "./components/MobileVotingModal";
import { useVotingSetupMobile } from "./hooks/useVotingSetupMobile";

interface SubmissionPageMobileVotingProps {
  isOpen: boolean;
  onClose?: () => void;
}

const SubmissionPageMobileVoting: FC<SubmissionPageMobileVotingProps> = ({ isOpen, onClose }) => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const {
    contestConfig,
    currentPricePerVote,
    currentPricePerVoteRaw,
    isVotingOpen,
    charge,
    contestState,
    isChargeLoading,
    votesClose,
  } = useVotingSetupMobile();
  const { castVotes, isLoading } = useVotingActions({ charge, votesClose });

  const handleClose = () => {
    setShowAddFunds(false);
    onClose?.();
  };

  if (isChargeLoading) {
    return null;
  }

  return (
    <MobileVotingDrawer
      isOpen={isOpen}
      showAddFunds={showAddFunds}
      chainName={contestConfig.chainName}
      chainNativeCurrencySymbol={contestConfig.chainNativeCurrencySymbol ?? ""}
      costToVote={currentPricePerVote}
      costToVoteRaw={currentPricePerVoteRaw}
      isLoading={isLoading}
      isVotingOpen={isVotingOpen}
      isContestCanceled={contestState === ContestStateEnum.Canceled}
      onClose={handleClose}
      onGoBack={() => setShowAddFunds(false)}
      onAddFunds={() => setShowAddFunds(true)}
      onVote={castVotes}
    />
  );
};

export default SubmissionPageMobileVoting;
