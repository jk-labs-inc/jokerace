import DialogModalProposal from "@components/_pages/DialogModalProposal";
import { Proposal } from "@components/_pages/ProposalContent";
import { FC } from "react";

interface SubmissionPageDesktopLayoutProps {
  contestInfo: {
    address: string;
    chain: string;
    version: string;
  };
  proposalId: string;
  prompt: string;
  proposal: Proposal | null;
  numberOfComments: number;
  isProposalLoading: boolean;
  isProposalError: boolean;
  onClose?: () => void;
  onVote?: (amount: number, isUpvote: boolean) => void;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onConnectWallet?: () => void;
}

const SubmissionPageDesktopLayout: FC<SubmissionPageDesktopLayoutProps> = ({
  contestInfo,
  proposalId,
  prompt,
  proposal,
  numberOfComments,
  isProposalLoading,
  isProposalError,
  onClose,
  onVote,
  onPreviousEntry,
  onNextEntry,
  onConnectWallet,
}) => {
  return (
    <DialogModalProposal
      contestInfo={contestInfo}
      proposalId={proposalId}
      prompt={prompt}
      isOpen={true}
      proposal={proposal}
      numberOfComments={numberOfComments}
      isProposalLoading={isProposalLoading}
      isProposalError={isProposalError}
      onClose={onClose}
      onVote={onVote}
      onConnectWallet={onConnectWallet}
      onNextEntry={onNextEntry}
      onPreviousEntry={onPreviousEntry}
    />
  );
};

export default SubmissionPageDesktopLayout;
