import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import SubmissionDeleteButton from "@components/_pages/Submission/components/Buttons/Delete";
import SubmissionDeleteModal from "@components/_pages/Submission/components/Modals/Delete";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import { ProposalData } from "lib/proposal";
import { FC, useState } from "react";
import EntryNavigation from "../EntryNavigation";

interface DialogModalProposalHeaderProps {
  proposalData: ProposalData | null;
  currentIndex: number;
  totalProposals: number;
  allowDelete: boolean;
  isProposalLoading: boolean;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
  onDeleteProposal?: () => void;
}

const DialogModalProposalHeader: FC<DialogModalProposalHeaderProps> = ({
  proposalData,
  currentIndex,
  totalProposals,
  isProposalLoading,
  allowDelete,
  onPreviousEntry,
  onNextEntry,
  onDeleteProposal,
}) => {
  const [isDeleteProposalModalOpen, setIsDeleteProposalModalOpen] = useState(false);

  if (!proposalData?.proposal) return null;

  const handleDeleteProposal = () => {
    setIsDeleteProposalModalOpen(false);
    onDeleteProposal?.();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {allowDelete && <SubmissionDeleteButton onClick={() => setIsDeleteProposalModalOpen(true)} />}
      <div className="flex gap-2 items-center">
        <p className="text-[20px] font-bold text-neutral-11">
          {formatNumberAbbreviated(proposalData.proposal.votes)} vote
          {proposalData.proposal.votes > 1 ? "s" : ""}
        </p>
        <span className="text-neutral-9">•</span>
        <p className="text-[20px] font-bold text-neutral-9">
          {ordinalize(proposalData.proposal.rank).label} place {proposalData.proposal.isTied ? "(tied)" : ""}
        </p>
      </div>
      <div className="flex justify-between w-full items-center">
        <UserProfileDisplay ethereumAddress={proposalData.proposal.authorEthereumAddress} shortenOnFallback={true} />
        <div className="flex items-center gap-2">
          {totalProposals > 1 && (
            <EntryNavigation
              currentIndex={currentIndex}
              totalProposals={totalProposals}
              isProposalLoading={isProposalLoading}
              onPreviousEntry={onPreviousEntry}
              onNextEntry={onNextEntry}
            />
          )}
        </div>
      </div>
      <SubmissionDeleteModal
        isDeleteProposalModalOpen={isDeleteProposalModalOpen}
        setIsDeleteProposalModalOpen={setIsDeleteProposalModalOpen}
        onClick={handleDeleteProposal}
      />
    </div>
  );
};

export default DialogModalProposalHeader;
