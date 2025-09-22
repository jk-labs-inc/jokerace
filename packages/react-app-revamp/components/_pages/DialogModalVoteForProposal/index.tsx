import AddFunds from "@components/AddFunds";
import { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV4 from "@components/UI/DialogModalV4";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import ordinalize from "@helpers/ordinalize";
import { getTotalCharge } from "@helpers/totalCharge";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { VoteType } from "@hooks/useDeployContest/types";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useEffect, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/react/shallow";
import { Proposal } from "../ProposalContent";

interface DialogModalVoteForProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  proposal: Proposal;
}

export const DialogModalVoteForProposal: FC<DialogModalVoteForProposalProps> = ({ isOpen, setIsOpen, proposal }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const {
    contestPrompt,
    charge: contestCharge,
    contestInfoData,
    contestAbi,
    votingClose,
  } = useContestStore(
    useShallow(state => ({
      contestPrompt: state.contestPrompt,
      charge: state.charge,
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
      contestVersion: state.version,
      votingClose: state.votesClose,
    })),
  );
  const { currentUserAvailableVotesAmount } = useUserStore(
    useShallow(state => ({
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
    })),
  );
  const isPayPerVote = contestCharge.voteType === VoteType.PerVote;
  const { castVotes, isSuccess } = useCastVotes();
  const [readFullEntry, setReadFullEntry] = useState(false);
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number } | null>(null);
  const [totalCharge, setTotalCharge] = useState("");
  const nativeToken = getNativeTokenSymbol(contestInfoData.contestChainName);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const {
    currentPricePerVote,
    isLoading: isCurrentPricePerVoteLoading,
    isError: isCurrentPricePerVoteError,
    isPreloading: isCurrentPricePerVotePreloading,
    isRefetching: isCurrentPricePerVoteRefetching,
    isRefetchError: isCurrentPricePerVoteRefetchError,
  } = useCurrentPricePerVoteWithRefetch({
    address: contestInfoData.contestAddress,
    abi: contestAbi,
    chainId: contestInfoData.contestChainId,
    votingClose: votingClose,
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

      castVotes(amount);
    },
    [currentUserAvailableVotesAmount, isPayPerVote, currentPricePerVote, castVotes],
  );

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
    setIsOpen(false);
    setShowAddFunds(false);
  };

  const toggleReadFullEntry = () => setReadFullEntry(!readFullEntry);

  useEffect(() => {
    if (isSuccess) setIsOpen(false);
  }, [isSuccess, setIsOpen]);

  return (
    <DialogModalV4 isOpen={isOpen} onClose={handleModalClose}>
      <div className="flex flex-col gap-4 pt-6 pb-4 md:py-16 px-6 md:pl-32 md:pr-16">
        {showAddFunds && nativeToken && contestInfoData.contestChainName ? (
          <div className="animate-swing-in-left">
            <AddFunds
              className="md:w-[400px]"
              chain={contestInfoData.contestChainName}
              asset={nativeToken ?? ""}
              onGoBack={() => setShowAddFunds(false)}
            />
          </div>
        ) : (
          <>
            <div className="hidden md:flex justify-between items-start">
              {showMaxVoteConfirmation ? null : <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />}
              <img
                src="/modal/modal_close.svg"
                width={33}
                height={33}
                alt="close"
                className="hidden md:block cursor-pointer ml-auto"
                onClick={handleModalClose}
              />
            </div>

            {showMaxVoteConfirmation ? (
              <DialogMaxVotesAlert
                token={nativeToken ?? ""}
                totalCost={totalCharge}
                onConfirm={confirmMaxVote}
                onCancel={cancelMaxVote}
                buttonSize={isMobile ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG_MOBILE}
              />
            ) : (
              <>
                <div className="hidden md:flex gap-2 items-center">
                  <UserProfileDisplay ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />
                  {proposal.rank > 0 && (
                    <div className="flex gap-2 items-center">
                      <span className="text-neutral-11">&#8226;</span>{" "}
                      <p className="text-[16px] font-bold text-neutral-11">
                        {formatNumberAbbreviated(proposal.votes)} vote{proposal.votes > 1 ? "s" : ""}
                      </p>
                      <span className="text-neutral-9">&#8226;</span>{" "}
                      <p className="text-[16px] font-bold text-neutral-9">
                        {ordinalize(proposal.rank).label} place {proposal.isTied ? "(tied)" : ""}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="hidden md:flex flex-col gap-2">
                    {!readFullEntry && (
                      <button
                        className="text-positive-11 text-[16px] bg-transparent flex items-center gap-2 self-start"
                        onClick={toggleReadFullEntry}
                      >
                        <p>read full entry</p>
                        <ChevronDownIcon className="w-6 h-6 text-positive-11" />
                      </button>
                    )}

                    {readFullEntry && (
                      <>
                        <ContestProposal proposal={proposal} />
                        <button
                          className="text-positive-11 text-[16px] bg-transparent flex items-center gap-2 self-start"
                          onClick={toggleReadFullEntry}
                        >
                          <p>hide full entry</p>
                          <ChevronUpIcon className="w-6 h-6 text-positive-11" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 md:gap-8 md:w-80">
                    <hr className="hidden md:block border border-neutral-2" />
                    <VotingWidget
                      proposalId={proposal.id}
                      amountOfVotes={currentUserAvailableVotesAmount}
                      onVote={onSubmitCastVotes}
                      onAddFunds={onAddFunds}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DialogModalV4>
  );
};

export default DialogModalVoteForProposal;
