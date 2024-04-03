import DialogModalProposal from "@components/_pages/DialogModalProposal";
import { ProposalData } from "lib/proposal";
import { FC } from "react";

interface SubmissionPageDesktopLayoutProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
  };
  proposalId: string;
  prompt: string;
  proposalData: ProposalData | null;
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
  proposalData,
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
      proposalData={proposalData}
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
