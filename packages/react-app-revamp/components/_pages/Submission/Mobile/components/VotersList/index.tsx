import ListProposalVotes from "@components/_pages/ListProposalVotes";
import { FC, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface SubmissionPageMobileVotersListProps {
  proposalId: string;
  addressesVoted: string[];
}

const SubmissionPageMobileVotersList: FC<SubmissionPageMobileVotersListProps> = ({ proposalId, addressesVoted }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={handleToggle}
          onKeyDown={e => e.key === "Enter" && handleToggle()}
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`voters list ${isExpanded ? "collapse" : "expand"}`}
        >
          <p className="text-[20px] text-neutral-11 font-bold">
            voters {addressesVoted.length > 0 ? <span className="text-[16px]">({addressesVoted.length})</span> : ""}
          </p>
          <ChevronDownIcon
            className={`w-5 h-5 text-neutral-11 transition-transform ${isExpanded ? "" : "transform rotate-180"}`}
          />
        </div>

        {isExpanded && (
          <ListProposalVotes proposalId={proposalId} votedAddresses={addressesVoted} className="text-neutral-9" />
        )}
      </div>
    </div>
  );
};

export default SubmissionPageMobileVotersList;
