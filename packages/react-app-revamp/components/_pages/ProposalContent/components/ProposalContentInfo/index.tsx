import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ordinalize from "@helpers/ordinalize";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { FC } from "react";

interface ProposalContentInfoProps {
  authorAddress: string;
  rank: number;
  isTied: boolean;
  isMobile: boolean;
  isContentHidden: boolean;
  toggleContentVisibility: () => void;
}

const ProposalContentInfo: FC<ProposalContentInfoProps> = ({
  authorAddress,
  rank,
  isTied,
  isMobile,
  isContentHidden,
  toggleContentVisibility,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <button
          onClick={toggleContentVisibility}
          className="p-1 rounded-full hover:bg-primary-2 transition-colors duration-300"
        >
          {isContentHidden ? (
            <PlusIcon className="w-4 h-4 text-neutral-9" />
          ) : (
            <MinusIcon className="w-4 h-4 text-neutral-9" />
          )}
        </button>
        <UserProfileDisplay ethereumAddress={authorAddress} shortenOnFallback={true} />

        {rank > 0 && (
          <>
            <span className="text-neutral-9">&#8226;</span>{" "}
            <p className="text-[16px] font-bold text-neutral-9">
              {isMobile ? (
                <>
                  {rank}
                  <sup>{ordinalize(rank).suffix}</sup> place {isTied ? "(tied)" : ""}
                </>
              ) : (
                `${ordinalize(rank).label} place ${isTied ? "(tied)" : ""}`
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalContentInfo;
