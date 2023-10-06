import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import VotingWidget from "@components/Voting";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import ContestProposal from "@components/_pages/Contest/components/Proposal";
import useCastVotes from "@hooks/useCastVotes";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { ProposalVotesWrapper } from "@hooks/useProposalVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useEffect } from "react";
import { useAccount } from "wagmi";
import ListProposalVotes from "../ListProposalVotes";
import { Proposal } from "../ProposalContent";

interface DialogModalProposalProps {
  isOpen: boolean;
  prompt: string;
  proposalId: string;
  proposal: Proposal;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onConnectWallet?: () => void;
}

const DialogModalProposal: FC<DialogModalProposalProps> = ({
  isOpen,
  setIsOpen,
  prompt,
  proposal,
  proposalId,
  onClose,
  onVote,
  onConnectWallet,
}) => {
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { isConnected } = useAccount();
  const { isSuccess } = useCastVotes();
  const { currentUserAvailableVotesAmount, currentUserTotalVotesAmount } = useUserStore(state => state);
  const outOfVotes = currentUserAvailableVotesAmount === 0 && currentUserTotalVotesAmount > 0;

  useEffect(() => {
    if (isSuccess) setIsOpen?.(false);
  }, [isSuccess, setIsOpen]);

  return (
    <DialogModalV3
      title="Proposal"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="xl:w-[1110px] 3xl:w-[1300px]"
      onClose={onClose}
    >
      <div className="flex flex-col gap-8 md:pl-[50px] lg:pl-[100px] mt-[20px] md:mt-[60px] pb-[60px]">
        <ContestPrompt type="modal" prompt={prompt} hidePrompt />
        <EthereumAddress ethereumAddress={proposal.authorEthereumAddress} shortenOnFallback={true} />
        <ContestProposal proposal={proposal} collapsible={false} contestStatus={contestStatus} />
        <div className="flex flex-col gap-8">
          {contestStatus === ContestStatus.VotingOpen && (
            <>
              <p className="text-neutral-11 text-[24px] font-bold">vote</p>
              {isConnected ? (
                currentUserAvailableVotesAmount > 0 ? (
                  <VotingWidget amountOfVotes={currentUserAvailableVotesAmount} onVote={onVote} />
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
                  <span className="text-positive-11 cursor-pointer" onClick={onConnectWallet}>
                    connect wallet
                  </span>{" "}
                  to see if you qualify
                </p>
              )}
            </>
          )}
          {proposal.votes > 0 && (
            <ProposalVotesWrapper>
              <ListProposalVotes proposalId={proposalId} />
            </ProposalVotesWrapper>
          )}
        </div>
      </div>
    </DialogModalV3>
  );
};

export default DialogModalProposal;
