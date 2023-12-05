import DialogModalProposal from "@components/_pages/DialogModalProposal";
import { Proposal } from "@components/_pages/ProposalContent";
import { Comment } from "@hooks/useComments/store";
import { FC } from "react";

interface SubmissionPageDesktopLayoutProps {
  address: string;
  chainName: string;
  proposalId: string;
  prompt: string;
  proposal: Proposal | null;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onConnectWallet?: () => void;
}

const SubmissionPageDesktopLayout: FC<SubmissionPageDesktopLayoutProps> = ({
  address,
  chainName,
  proposalId,
  prompt,
  proposal,
  onClose,
  onVote,
  onPreviousEntry,
  onNextEntry,
  onConnectWallet,
}) => {
  return (
    <DialogModalProposal
      address={address}
      chainName={chainName}
      proposalId={proposalId}
      prompt={prompt}
      isOpen={true}
      proposal={proposal}
      onClose={onClose}
      onVote={onVote}
      onConnectWallet={onConnectWallet}
      onNextEntry={onNextEntry}
      onPreviousEntry={onPreviousEntry}
    />
  );
};

export default SubmissionPageDesktopLayout;
