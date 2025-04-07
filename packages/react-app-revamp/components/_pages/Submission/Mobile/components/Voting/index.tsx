import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import Onramp from "@components/Onramp";
import { ButtonSize } from "@components/UI/ButtonV3";
import VotingWidget from "@components/Voting";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { getTotalCharge } from "@helpers/totalCharge";
import { Charge } from "@hooks/useDeployContest/types";
import { FC, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface SubmissionPageMobileVotingProps {
  isOpen: boolean;
  proposalId: string;
  amountOfVotes: number;
  charge: Charge;
  isPayPerVote: boolean;
  currentUserAvailableVotesAmount: number;
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
    version: string;
  };
  downvoteAllowed: boolean;
  onVote: (amount: number, isUpvote: boolean) => void;
  onClose: () => void;
}
const SubmissionPageMobileVoting: FC<SubmissionPageMobileVotingProps> = ({
  isOpen,
  onClose,
  proposalId,
  amountOfVotes,
  contestInfo,
  charge,
  isPayPerVote,
  currentUserAvailableVotesAmount,
  onVote,
  downvoteAllowed,
}) => {
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number; isUpvote: boolean } | null>(null);
  const [totalCharge, setTotalCharge] = useState("");
  const nativeToken = getNativeTokenSymbol(contestInfo.chain);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [showOnrampModal, setShowOnrampModal] = useState(false);
  const onSubmitCastVotes = (amount: number, isUpvote: boolean) => {
    if (amount === currentUserAvailableVotesAmount && isPayPerVote) {
      setShowMaxVoteConfirmation(true);
      setPendingVote({ amount, isUpvote });
      setTotalCharge(getTotalCharge(amount, charge?.type.costToVote ?? 0));
      return;
    }

    onVote?.(amount, isUpvote);
  };

  const confirmMaxVote = () => {
    if (pendingVote) {
      onVote?.(pendingVote.amount, pendingVote.isUpvote);
      setShowMaxVoteConfirmation(false);
      setPendingVote(null);
    }
  };

  const cancelMaxVote = () => {
    setShowMaxVoteConfirmation(false);
    setPendingVote(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-neutral-8 bg-opacity-40 pointer-events-none" />
      <div
        className={`absolute animate-appear inset-x-0 bottom-0 bg-true-black 
                border-t border-neutral-9 rounded-t-[40px] p-6 pb-12 
                ${isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300`}
      >
        {showOnrampModal ? (
          <Onramp chain={contestInfo.chain} asset={nativeToken ?? ""} onGoBack={() => setShowOnrampModal(false)} />
        ) : showMaxVoteConfirmation ? (
          <DialogMaxVotesAlert
            token={nativeToken ?? ""}
            totalCost={totalCharge}
            onConfirm={confirmMaxVote}
            onCancel={cancelMaxVote}
            buttonSize={ButtonSize.FULL}
          />
        ) : (
          <VotingWidget
            proposalId={proposalId}
            amountOfVotes={amountOfVotes}
            onVote={onSubmitCastVotes}
            downvoteAllowed={downvoteAllowed}
            onAddFunds={() => {
              setShowOnrampModal(true);
            }}
          />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default SubmissionPageMobileVoting;
