import AddFunds from "@components/AddFunds";
import VotingWidget from "@components/Voting";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useCastVotes from "@hooks/useCastVotes";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useCharge from "@hooks/useCharge";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useShallow } from "zustand/shallow";
import { useReadContract } from "wagmi";
import useProposalIdStore from "@hooks/useProposalId/store";

interface SubmissionPageMobileVotingProps {
  isOpen: boolean;
  onClose?: () => void;
}

const SubmissionPageMobileVoting: FC<SubmissionPageMobileVotingProps> = ({ isOpen, onClose }) => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const currentUserAvailableVotesAmount = useUserStore(useShallow(state => state.currentUserAvailableVotesAmount));
  const [showAddFunds, setShowAddFunds] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { charge, isLoading: isChargeLoading } = useCharge({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });
  const votesClose = new Date(Number(voteTimings?.contestDeadline) * 1000 + 1000);
  const { castVotes } = useCastVotes({ charge: charge, votesClose: votesClose });
  const { isLoading, isSuccess } = useCastVotesStore(state => state);
  const { refetch: refetchProposalVotes } = useReadContract({
    address: contestConfig.address as `0x${string}`,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    functionName: "proposalVotes",
    args: [proposalId],
  });

  const { refetch: refetchProposalVoters } = useReadContract({
    address: contestConfig.address as `0x${string}`,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    functionName: "proposalAddressesHaveVoted",
    args: [proposalId],
  });

  useEffect(() => {
    if (isLoading) return;

    if (isSuccess) {
      const refetchWithDelay = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        refetchProposalVotes();
        refetchProposalVoters();
      };

      refetchWithDelay();
    }
  }, [isSuccess, isLoading, refetchProposalVotes, refetchProposalVoters, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose?.();
    }
  };

  if (isChargeLoading) {
    return null;
  }

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
          <AddFunds
            chain={contestConfig.chainName}
            asset={contestConfig.chainNativeCurrencySymbol}
            onGoBack={() => setShowAddFunds(false)}
          />
        ) : (
          <VotingWidget
            amountOfVotes={currentUserAvailableVotesAmount}
            costToVote={charge.type.costToVote}
            isLoading={isLoading}
            isVotingClosed={false}
            isContestCanceled={false}
            onVote={castVotes}
            onAddFunds={() => setShowAddFunds(true)}
          />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default SubmissionPageMobileVoting;
