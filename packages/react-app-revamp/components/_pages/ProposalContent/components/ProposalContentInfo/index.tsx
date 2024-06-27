import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ordinalize from "@helpers/ordinalize";
import { FC } from "react";

interface ProposalContentInfoProps {
  authorAddress: string;
  rank: number;
  isTied: boolean;
  isMobile: boolean;
}

const ProposalContentInfo: FC<ProposalContentInfoProps> = ({ authorAddress, rank, isTied, isMobile }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
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
