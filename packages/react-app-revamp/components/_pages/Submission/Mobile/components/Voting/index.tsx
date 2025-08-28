import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import { ButtonSize } from "@components/UI/ButtonV3";
import VotingWidget from "@components/Voting";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { getTotalCharge } from "@helpers/totalCharge";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { Charge } from "@hooks/useDeployContest/types";
import { FC, useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useShallow } from "zustand/shallow";
import SubmissionPageMobileAddFunds from "../AddFunds";

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
  onVote?: (amount: number) => void;
  onClose?: () => void;
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
}) => {
  const { contestAbi, votesClose } = useContestStore(
    useShallow(state => ({
      contestAbi: state.contestAbi,
      votesClose: state.votesClose,
    })),
  );
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number } | null>(null);
  const [totalCharge, setTotalCharge] = useState("");
  const nativeToken = getNativeTokenSymbol(contestInfo.chain);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const {
    currentPricePerVote,
    isLoading: isCurrentPricePerVoteLoading,
    isError: isCurrentPricePerVoteError,
    isPreloading: isCurrentPricePerVotePreloading,
    isRefetching: isCurrentPricePerVoteRefetching,
    isRefetchError: isCurrentPricePerVoteRefetchError,
  } = useCurrentPricePerVoteWithRefetch({
    address: contestInfo.address,
    abi: contestAbi,
    chainId: contestInfo.chainId,
    version: contestInfo.version,
    votingClose: votesClose,
  });
  const earlyReturn =
    isCurrentPricePerVoteLoading ||
    isCurrentPricePerVoteError ||
    isCurrentPricePerVotePreloading ||
    isCurrentPricePerVoteRefetching ||
    isCurrentPricePerVoteRefetchError ||
    !currentPricePerVote;

  const onSubmitCastVotes = useCallback(
    (amount: number) => {
      if (earlyReturn) {
        return;
      }

      if (amount === currentUserAvailableVotesAmount && isPayPerVote) {
        setShowMaxVoteConfirmation(true);
        setPendingVote({ amount });
        setTotalCharge(getTotalCharge(amount, currentPricePerVote));
        return;
      }

      onVote?.(amount);
    },
    [currentUserAvailableVotesAmount, isPayPerVote, currentPricePerVote, onVote],
  );

  const confirmMaxVote = () => {
    if (pendingVote) {
      onVote?.(pendingVote.amount);
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
      onClose?.();
    }
  };

  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-neutral-8/40 pointer-events-none" />
      <div
        className={`absolute animate-appear inset-x-0 bottom-0 bg-true-black 
                border-t border-neutral-9 rounded-t-[40px] p-6 pb-4
                ${isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300`}
      >
        {showAddFunds ? (
          <SubmissionPageMobileAddFunds
            chain={contestInfo.chain}
            asset={nativeToken ?? ""}
            isOpen={showAddFunds}
            onClose={() => setShowAddFunds(false)}
          />
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
            onAddFunds={() => {
              setShowAddFunds(true);
            }}
          />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default SubmissionPageMobileVoting;
