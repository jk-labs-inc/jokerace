import DialogModalV4 from "@components/UI/DialogModalV4";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Prompt/Proposal";
import DialogMaxVotesAlert from "@components/_pages/DialogMaxVotesAlert";
import { extractPathSegments } from "@helpers/extractPath";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import ordinalize from "@helpers/ordinalize";
import { getTotalCharge } from "@helpers/totalCharge";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import useCastVotes from "@hooks/useCastVotes";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "@hooks/useUser/store";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Proposal } from "../ProposalContent";
import { VoteType } from "@hooks/useDeployContest/types";

interface DialogModalVoteForProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  proposal: Proposal;
}

export const DialogModalVoteForProposal: FC<DialogModalVoteForProposalProps> = ({ isOpen, setIsOpen, proposal }) => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const { downvotingAllowed, contestPrompt, charge: contestCharge } = useContestStore(state => state);
  const { currentUserAvailableVotesAmount } = useUserStore(state => state);
  const isPayPerVote = contestCharge?.voteType === VoteType.PerVote;
  const { castVotes, isSuccess } = useCastVotes();
  const [readFullEntry, setReadFullEntry] = useState(false);
  const [showMaxVoteConfirmation, setShowMaxVoteConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ amount: number; isUpvote: boolean } | null>(null);
  const [totalCharge, setTotalCharge] = useState("");
  const nativeToken = getNativeTokenSymbol(chainName);

  const onSubmitCastVotes = (amount: number, isUpvote: boolean) => {
    if (amount === currentUserAvailableVotesAmount && isPayPerVote) {
      setShowMaxVoteConfirmation(true);
      setPendingVote({ amount, isUpvote });
      setTotalCharge(getTotalCharge(amount, contestCharge?.type.costToVote ?? 0));
      return;
    }

    castVotes(amount, isUpvote);
  };

  const confirmMaxVote = () => {
    if (pendingVote) {
      castVotes(pendingVote.amount, pendingVote.isUpvote);
      setShowMaxVoteConfirmation(false);
      setPendingVote(null);
    }
  };

  const cancelMaxVote = () => {
    setShowMaxVoteConfirmation(false);
    setPendingVote(null);
  };

  const toggleReadFullEntry = () => setReadFullEntry(!readFullEntry);

  useEffect(() => {
    if (isSuccess) setIsOpen(false);
  }, [isSuccess, setIsOpen]);

  return (
    <DialogModalV4 isOpen={isOpen} onClose={setIsOpen}>
      <div className="flex flex-col gap-4 py-6 md:py-16 px-6 md:pl-32 md:pr-16">
        <div className="hidden md:flex justify-between items-start">
          {showMaxVoteConfirmation ? null : <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />}
          <img
            src="/modal/modal_close.svg"
            width={33}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer ml-auto"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {showMaxVoteConfirmation ? (
          <DialogMaxVotesAlert
            token={nativeToken ?? ""}
            totalCost={totalCharge}
            onConfirm={confirmMaxVote}
            onCancel={cancelMaxVote}
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
                  downvoteAllowed={downvotingAllowed}
                  onVote={onSubmitCastVotes}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </DialogModalV4>
  );
};

export default DialogModalVoteForProposal;
