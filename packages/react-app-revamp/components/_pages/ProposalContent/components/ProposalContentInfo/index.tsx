import EthereumAddress from "@components/UI/EtheuremAddress";
import ordinalize from "@helpers/ordinalize";
import Image from "next/image";
import { FC } from "react";

interface ProposalContentInfoProps {
  authorAddress: string;
  rank: number;
  isTied: boolean;
  commentsCount: number;
  isMobile: boolean;
}

const ProposalContentInfo: FC<ProposalContentInfoProps> = ({
  authorAddress,
  rank,
  isTied,
  commentsCount,
  isMobile,
}) => {
  return (
    <div className="px-4 mt-4 flex items-center gap-3">
      <div className="flex items-center gap-1">
        <EthereumAddress ethereumAddress={authorAddress} shortenOnFallback={true} />

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

        {commentsCount > 0 ? (
          <>
            <span className="text-neutral-9">&#8226;</span>{" "}
            <div className="flex items-center ml-1 gap-1">
              <Image src="/contest/comment_icon.svg" className="mt-[6px]" alt="comments" width={24} height={23} />
              <p className="text-[16px] font-bold text-neutral-9">{commentsCount}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProposalContentInfo;
