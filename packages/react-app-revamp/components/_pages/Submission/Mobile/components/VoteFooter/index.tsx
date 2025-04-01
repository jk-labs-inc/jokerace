import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";

interface StickyVoteFooterProps {
  isConnected: boolean;
  totalProposals: number;
  currentUserAvailableVotesAmount: number;
  outOfVotes: boolean;
  isPayPerVote: boolean;
  contestInfo: {
    chain: string;
  };
  chainCurrencySymbol: string;
  onConnectWallet: () => void;
  setShowVotingModal: (show: boolean) => void;
  linkBridgeDocs: string;
}

const StickyVoteFooter: FC<StickyVoteFooterProps> = ({
  isConnected,
  totalProposals,
  currentUserAvailableVotesAmount,
  outOfVotes,
  isPayPerVote,
  contestInfo,
  chainCurrencySymbol,
  onConnectWallet,
  setShowVotingModal,
  linkBridgeDocs,
}) => {
  return (
    <div
      className={`fixed ${totalProposals > 1 ? "bottom-[106px]" : "bottom-14"} left-0 right-0 bg-true-black z-40 pb-4`}
    >
      <div className="mx-auto flex justify-center px-10 max-w-md w-full">
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
          ) : outOfVotes ? (
            <p className="text-[16px] text-neutral-11 text-center">
              looks like you've used up all your votes this contest
            </p>
          ) : isPayPerVote ? (
            <ButtonV3
              onClick={() => window.open(linkBridgeDocs, "_blank")}
              colorClass="bg-gradient-purple"
              textColorClass="text-true-black rounded-[40px]"
              size={ButtonSize.FULL}
            >
              add {chainCurrencySymbol} to {contestInfo.chain} to get votes
            </ButtonV3>
          ) : (
            <p className="text-[16px] text-neutral-11 text-center">
              unfortunately your wallet didn't qualify to vote in this contest
            </p>
          )
        ) : (
          <ButtonV3
            onClick={onConnectWallet}
            colorClass="bg-gradient-purple"
            textColorClass="text-true-black rounded-[40px]"
            size={ButtonSize.FULL}
          >
            connect wallet {isPayPerVote ? "to add votes" : "to see if you qualify"}
          </ButtonV3>
        )}
      </div>
    </div>
  );
};

export default StickyVoteFooter;
