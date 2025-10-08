import Comments from "@components/Comments";
import { FC, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import { useShallow } from "zustand/shallow";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";

interface SubmissionPageMobileCommentsProps {
  numberOfComments: number | null;
}

const SubmissionPageMobileComments: FC<SubmissionPageMobileCommentsProps> = ({ numberOfComments }) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const contestDetails = useSubmissionPageStore(useShallow(state => state.contestDetails));
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={handleToggle}
        onKeyDown={e => e.key === "Enter" && handleToggle()}
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`comments list ${isExpanded ? "collapse" : "expand"}`}
      >
        <p className="text-[20px] text-neutral-11 font-bold">
          comments{numberOfComments ? <span className="text-[16px]"> ({numberOfComments})</span> : ""}
        </p>
        <ChevronDownIcon
          className={`w-5 h-5 text-neutral-11 transition-transform ${isExpanded ? "" : "transform rotate-180"}`}
        />
      </div>

      {isExpanded && (
        <Comments
          contestAddress={contestConfig.address}
          contestChainId={contestConfig.chainId}
          contestState={contestDetails.state}
          contestAuthor={contestDetails.author ?? ""}
          proposalId={proposalId}
          numberOfComments={numberOfComments}
          className="text-neutral-9"
        />
      )}
    </div>
  );
};

export default SubmissionPageMobileComments;
