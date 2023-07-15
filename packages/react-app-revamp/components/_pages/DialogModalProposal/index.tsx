import DialogModalV3 from "@components/UI/DialogModalV3";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import VotingWidget from "@components/Voting";
import useCastVotes from "@hooks/useCastVotes";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ProposalVotesWrapper } from "@hooks/useProposalVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import LayoutContestPrompt from "@layouts/LayoutViewContest/Prompt";
import LayoutContestProposal from "@layouts/LayoutViewContest/Proposal";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FC, useEffect } from "react";
import { useAccount } from "wagmi";
import ListProposalVotes from "../ListProposalVotes";
import { Proposal } from "../ProposalContent";

interface DialogModalProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  prompt: string;
  proposalId: string;
  proposal: Proposal;
}

const DialogModalProposal: FC<DialogModalProposalProps> = ({ isOpen, setIsOpen, prompt, proposal, proposalId }) => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { castVotes, isLoading } = useCastVotes();
  const {
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
    decreaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserTotalVotesCast,
    decreaseCurrentUserTotalVotesCast,
  } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;

  const onSubmitCastVotes = (amount: number, isUpvote: boolean) => {
    decreaseCurrentUserAvailableVotesAmount(amount);
    increaseCurrentUserTotalVotesCast(amount);

    castVotes(amount, isUpvote).catch(error => {
      increaseCurrentUserAvailableVotesAmount(amount);
      decreaseCurrentUserTotalVotesCast(amount);
    });
  };

  useEffect(() => {
    if (isLoading) setIsOpen(false);
  }, [isLoading]);

  return (
    <DialogModalV3 title="Proposal" isOpen={isOpen} setIsOpen={setIsOpen} className="xl:w-[1110px] 3xl:w-[1300px] ">
      <div className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[60px] pb-[60px]">
        <LayoutContestPrompt prompt={prompt} hidePrompt />
        <EtheuremAddress
          ethereumAddress={proposal.authorEthereumAddress}
          shortenOnFallback={true}
          displayLensProfile={true}
        />
        <LayoutContestProposal proposal={proposal} collapsible={false} contestStatus={contestStatus} />
        {contestStatus === ContestStatus.VotingOpen && (
          <div className="flex flex-col gap-8">
            <p className="text-neutral-11 text-[24px] font-bold">vote</p>
            {isConnected ? (
              currentUserAvailableVotesAmount > 0 ? (
                <VotingWidget amountOfVotes={currentUserAvailableVotesAmount} onVote={onSubmitCastVotes} />
              ) : outOfVotes ? (
                <p className="text-[16px] text-neutral-11">
                  looks like you’ve used up all your votes this contest <br />
                  feel free to try connecting another wallet to see if it has more votes!
                </p>
              ) : (
                <p className="text-[16px] text-neutral-11">
                  unfortunately your wallet didn’t qualify to vote in this contest <br />
                  feel free to try connecting another wallet!
                </p>
              )
            ) : (
              <p className="text-[16px] font-bold text-neutral-11 mt-2">
                <span className="text-positive-11 cursor-pointer" onClick={openConnectModal}>
                  connect wallet
                </span>{" "}
                to see if you qualify
              </p>
            )}
          </div>
        )}
        {contestStatus !== ContestStatus.SubmissionOpen && proposal.votes > 0 && (
          <ProposalVotesWrapper>
            <ListProposalVotes proposalId={proposalId} proposal={proposal} />
          </ProposalVotesWrapper>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
