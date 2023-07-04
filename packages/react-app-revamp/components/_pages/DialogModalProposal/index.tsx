import DialogModalV3 from "@components/UI/DialogModalV3";
import EtheuremAddress from "@components/UI/EtheuremAddress";
import VotingWidget from "@components/Voting";
import useCastVotes from "@hooks/useCastVotes";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ProposalWrapper } from "@hooks/useProposal/store";
import { ProposalVotesWrapper } from "@hooks/useProposalVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import LayoutContestPrompt from "@layouts/LayoutViewContest/Prompt";
import LayoutContestProposal from "@layouts/LayoutViewContest/Proposal";
import { FC } from "react";
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
  const { castVotes } = useCastVotes();

  const { currentUserAvailableVotesAmount } = useUserStore(state => state);

  function onSubmitCastVotes(amount: string, isPositive: boolean) {
    castVotes(parseFloat(amount), isPositive);
  }
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
            <VotingWidget amountOfVotes={currentUserAvailableVotesAmount} onVote={onSubmitCastVotes} />
          </div>
        )}
        {contestStatus !== ContestStatus.SubmissionOpen && (
          <ProposalVotesWrapper>
            <ListProposalVotes proposalId={proposalId} proposal={proposal} />
          </ProposalVotesWrapper>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
