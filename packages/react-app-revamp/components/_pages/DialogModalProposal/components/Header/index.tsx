import { isEntryPreviewPrompt } from "@components/_pages/DialogModalSendProposal/utils";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import ordinalize from "@helpers/ordinalize";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import { ProposalData } from "lib/proposal";
import { FC, useEffect, useState } from "react";
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
  const { fields: metadataFields } = useMetadataStore(state => state);
  const hasEntryPreview = metadataFields.length > 0 && isEntryPreviewPrompt(metadataFields[0].prompt);
  const [entryTitle, setEntryTitle] = useState<string>("");

  useEffect(() => {
    checkEntryPreviewFormat();
  }, [proposalData]);

  const checkEntryPreviewFormat = () => {
    if (!hasEntryPreview || !proposalData?.proposal) return;

    const { stringArray } = proposalData.proposal.metadataFields;
    const params = new URLSearchParams(stringArray[0]);

    const title = params.get("JOKERACE_IMG_TITLE") ?? stringArray[0];
    setEntryTitle(title);
  };

  if (!proposalData?.proposal) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {entryTitle && <div className="text-[24px] font-bold text-neutral-11 normal-case">{entryTitle}</div>}
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <UserProfileDisplay ethereumAddress={proposalData.proposal.authorEthereumAddress} shortenOnFallback={true} />
          {proposalData.proposal.rank > 0 && (
            <div className="flex gap-2 items-center">
              <p className="text-[16px] font-bold text-neutral-11">
                {formatNumberAbbreviated(proposalData.proposal.votes)} vote
                {proposalData.proposal.votes > 1 ? "s" : ""}
              </p>
              <span className="text-neutral-9">•</span>
              <p className="text-[16px] font-bold text-neutral-9">
                {ordinalize(proposalData.proposal.rank).label} place {proposalData.proposal.isTied ? "(tied)" : ""}
              </p>
            </div>
          )}
        </div>
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
