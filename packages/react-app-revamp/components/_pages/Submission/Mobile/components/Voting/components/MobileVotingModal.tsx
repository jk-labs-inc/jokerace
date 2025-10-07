import AddFunds from "@components/AddFunds";
import VotingWidget from "@components/Voting";
import { FC, RefObject } from "react";
import ReactDOM from "react-dom";

interface MobileVotingModalProps {
  isOpen: boolean;
  showAddFunds: boolean;
  chainName: string;
  chainNativeCurrencySymbol: string;
  amountOfVotes: number;
  costToVote: number;
  isLoading: boolean;
  isVotingOpen: boolean;
  backdropRef: RefObject<HTMLDivElement | null>;
  onBackdropClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onGoBack: () => void;
  onAddFunds: () => void;
  onVote: (amount: number) => void;
}

const MobileVotingModal: FC<MobileVotingModalProps> = ({
  isOpen,
  showAddFunds,
  chainName,
  chainNativeCurrencySymbol,
  amountOfVotes,
  costToVote,
  isLoading,
  isVotingOpen,
  backdropRef,
  onBackdropClick,
  onGoBack,
  onAddFunds,
  onVote,
}) => {
  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={onBackdropClick}
    >
      <div className="absolute inset-0 bg-neutral-8/40 pointer-events-none" />
      <div
        className={`absolute animate-appear inset-x-0 bottom-0 bg-true-black
                border-t border-neutral-9 rounded-t-[40px] p-6 pb-4
                ${isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300`}
      >
        {showAddFunds ? (
          <AddFunds chain={chainName} asset={chainNativeCurrencySymbol} onGoBack={onGoBack} />
        ) : (
          <VotingWidget
            amountOfVotes={amountOfVotes}
            costToVote={costToVote}
            isLoading={isLoading}
            isVotingClosed={!isVotingOpen}
            isContestCanceled={false}
            onVote={onVote}
            onAddFunds={onAddFunds}
          />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default MobileVotingModal;
