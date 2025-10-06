import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";

interface StickyVoteFooterProps {
  isConnected: boolean;
  totalProposals: number;
  currentUserAvailableVotesAmount: number;
  onConnectWallet: () => void;
  setShowVotingModal: (show: boolean) => void;
  onAddFunds?: () => void;
}

const StickyVoteFooter: FC<StickyVoteFooterProps> = ({
  isConnected,
  totalProposals,
  currentUserAvailableVotesAmount,
  onConnectWallet,
  setShowVotingModal,
  onAddFunds,
}) => {
  return (
    <div className={`fixed ${totalProposals > 1 ? "bottom-[106px]" : "bottom-14"} left-0 right-0 bg-transparent pb-8`}>
      <div className="mx-auto flex justify-center px-8 max-w-md w-full">
        {isConnected ? (
          currentUserAvailableVotesAmount > 0 ? (
            <ButtonV3
              onClick={() => setShowVotingModal(true)}
              colorClass="bg-gradient-purple"
              textColorClass="text-true-black rounded-[40px]"
              size={ButtonSize.FULL}
            >
              add votes
            </ButtonV3>
          ) : (
            <ButtonV3
              onClick={onAddFunds}
              colorClass="bg-gradient-create text-true-black rounded-[40px]"
              size={ButtonSize.FULL}
            >
              add funds to vote
            </ButtonV3>
          )
        ) : (
          <ButtonV3
            onClick={onConnectWallet}
            colorClass="bg-gradient-purple"
            textColorClass="text-true-black rounded-[40px]"
            size={ButtonSize.FULL}
          >
            connect wallet to add votes
          </ButtonV3>
        )}
      </div>
    </div>
  );
};

export default StickyVoteFooter;
