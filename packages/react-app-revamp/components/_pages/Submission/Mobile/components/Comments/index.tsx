import Comments from "@components/Comments";
import { FC, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface SubmissionPageMobileCommentsProps {
  proposalId: string;
  numberOfComments: number | null;
  address: string;
  chainId: number;
}

const SubmissionPageMobileComments: FC<SubmissionPageMobileCommentsProps> = ({
  proposalId,
  numberOfComments,
  address,
  chainId,
}) => {
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
          comments{numberOfComments ? ` (${numberOfComments})` : ""}
        </p>
        <ChevronDownIcon
          className={`w-5 h-5 text-neutral-11 transition-transform ${isExpanded ? "" : "transform rotate-180"}`}
        />
      </div>

      {isExpanded && (
        <Comments
          contestAddress={address}
          contestChainId={chainId}
          proposalId={proposalId}
          numberOfComments={numberOfComments}
          className="text-neutral-9"
        />
      )}
    </div>
  );
};

export default SubmissionPageMobileComments;
