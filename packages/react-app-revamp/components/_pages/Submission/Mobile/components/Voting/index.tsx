import { useVotingActions } from "@components/_pages/Submission/hooks/useVotingActions";
import { FC, useRef, useState } from "react";
import MobileVotingModal from "./components/MobileVotingModal";
import { useVotingSetupMobile } from "./hooks/useVotingSetupMobile";
import { ContestStateEnum } from "@hooks/useContestState/store";

interface SubmissionPageMobileVotingProps {
  isOpen: boolean;
  onClose?: () => void;
}

const SubmissionPageMobileVoting: FC<SubmissionPageMobileVotingProps> = ({ isOpen, onClose }) => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const {
    contestConfig,
    currentUserAvailableVotesAmount,
    currentPricePerVote,
    isVotingOpen,
    charge,
    contestState,
    isChargeLoading,
    votesClose,
  } = useVotingSetupMobile();
  const { castVotes, isLoading } = useVotingActions({ charge, votesClose });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose?.();
    }
  };

  if (isChargeLoading) {
    return null;
  }

  return (
    <MobileVotingModal
      isOpen={isOpen}
      showAddFunds={showAddFunds}
      chainName={contestConfig.chainName}
      chainNativeCurrencySymbol={contestConfig.chainNativeCurrencySymbol}
      amountOfVotes={currentUserAvailableVotesAmount}
      costToVote={Number(currentPricePerVote)}
      isLoading={isLoading}
      isVotingOpen={isVotingOpen}
      isContestCanceled={contestState === ContestStateEnum.Canceled}
      backdropRef={backdropRef}
      onBackdropClick={handleBackdropClick}
      onGoBack={() => setShowAddFunds(false)}
      onAddFunds={() => setShowAddFunds(true)}
      onVote={castVotes}
    />
  );
};

export default SubmissionPageMobileVoting;
