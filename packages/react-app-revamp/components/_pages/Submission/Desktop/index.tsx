import DialogModalProposal from "@components/_pages/DialogModalProposal";
import { Proposal } from "@components/_pages/ProposalContent";
import { FC } from "react";

interface SubmissionPageDesktopLayoutProps {
  proposalId: string;
  prompt: string;
  proposal: Proposal;
  onClose?: () => void;
}

const SubmissionPageDesktopLayout: FC<SubmissionPageDesktopLayoutProps> = ({
  proposalId,
  prompt,
  proposal,
  onClose,
}) => {
  return (
    <DialogModalProposal proposalId={proposalId} prompt={prompt} isOpen={true} proposal={proposal} onClose={onClose} />
  );
};

export default SubmissionPageDesktopLayout;
