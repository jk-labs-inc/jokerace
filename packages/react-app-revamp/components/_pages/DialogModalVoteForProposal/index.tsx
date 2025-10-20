import AddFunds from "@components/AddFunds";
import { ButtonSize } from "@components/UI/ButtonV3";
import Drawer from "@components/UI/Drawer";
import VotingWidget from "@components/Voting";
import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/shallow";

interface DialogModalVoteForProposalProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const DialogModalVoteForProposal: FC<DialogModalVoteForProposalProps> = ({ isOpen, setIsOpen }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { charge: contestCharge, votingClose } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
      votingClose: state.votesClose,
    })),
  );
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const contestState = useContestStateStore(useShallow(state => state.contestState));
  const { castVotes, isLoading } = useCastVotes({ charge: contestCharge, votesClose: votingClose });
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number } | null>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const {
    currentPricePerVote,
    currentPricePerVoteRaw,
    isLoading: isCurrentPricePerVoteLoading,
  } = useCurrentPricePerVote({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose,
  });

  const onVote = (amount: number) => {
    castVotes(amount);
  };

  const confirmMaxVote = () => {
    if (pendingVote) {
      castVotes(pendingVote.amount);
      setShowMaxVoteConfirmation(false);
      setPendingVote(null);
    }
  };

  const cancelMaxVote = () => {
    setShowMaxVoteConfirmation(false);
    setPendingVote(null);
  };

  const onAddFunds = () => {
    setShowAddFunds(true);
  };

  const handleModalClose = () => {
    setIsOpen?.(false);
    setShowAddFunds(false);
  };

  return (
    <Drawer
      isHandleHidden={!isMobile}
      isOpen={isOpen}
      onClose={handleModalClose}
      className="bg-true-black w-full h-auto md:max-w-[500px] m-auto"
    >
      <div className="flex flex-col gap-4 p-6 md:p-8">
        {showAddFunds ? (
          <div className="animate-swing-in-left">
            <AddFunds
              chain={contestConfig.chainName}
              asset={contestConfig.chainNativeCurrencySymbol ?? ""}
              onGoBack={() => setShowAddFunds(false)}
            />
          </div>
        ) : (
          <>
            {showMaxVoteConfirmation ? (
              <DialogMaxVotesAlert
                onConfirm={confirmMaxVote}
                onCancel={cancelMaxVote}
                buttonSize={isMobile ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG_MOBILE}
              />
            ) : (
              <VotingWidget
                costToVote={currentPricePerVote}
                costToVoteRaw={currentPricePerVoteRaw}
                isLoading={isCurrentPricePerVoteLoading || isLoading}
                isVotingClosed={contestStatus === ContestStatus.VotingClosed}
                isContestCanceled={contestState === ContestStateEnum.Canceled}
                onVote={onVote}
                onAddFunds={onAddFunds}
              />
            )}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default DialogModalVoteForProposal;
