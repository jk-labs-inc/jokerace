import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import { ProposalData } from "lib/proposal";
import { FC } from "react";
import EntryNavigation from "../EntryNavigation";

interface DialogModalProposalHeaderProps {
  proposalData: ProposalData | null;
  currentIndex: number;
  totalProposals: number;
  isProposalLoading: boolean;
  onPreviousEntry?: () => void;
  onNextEntry?: () => void;
}

const DialogModalProposalHeader: FC<DialogModalProposalHeaderProps> = ({
  proposalData,
  currentIndex,
  totalProposals,
  isProposalLoading,
  onPreviousEntry,
  onNextEntry,
}) => {
  if (!proposalData?.proposal) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {proposalData.proposal.rank > 0 && (
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
      )}
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
    </div>
  );
};

export default DialogModalProposalHeader;
