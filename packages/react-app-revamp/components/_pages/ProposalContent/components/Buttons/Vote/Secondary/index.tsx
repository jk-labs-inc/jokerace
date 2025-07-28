import { Proposal } from "@components/_pages/ProposalContent";
import { getNumberWithSymbol } from "@helpers/formatNumber";
import { FC } from "react";

interface ProposalContentVoteSecondaryProps {
  proposal: Proposal;
  handleVotingModalOpen?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ProposalContentVoteSecondary: FC<ProposalContentVoteSecondaryProps> = ({ proposal, handleVotingModalOpen }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleVotingModalOpen?.(e);
  };

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-vote-rainbow">
      <div className="group bg-true-black hover:bg-gradient-vote-rainbow transition-colors duration-300 ease-in-out rounded-[calc(2rem-1px)] p-[2px]">
        <button
          onClick={handleClick}
          className="min-w-16 shrink-0 h-6 px-2 flex items-center justify-between gap-2 cursor-pointer text-neutral-11 group-hover:text-true-black w-full"
        >
          <img src="/contest/upvote-3.svg" width={14} height={15} alt="upvote" className="shrink-0" />
          <p className="text-[16px] font-bold flex-grow text-center">
            {(() => {
              const { value, symbol } = getNumberWithSymbol(proposal.votes);
              return (
                <>
                  {value}
                  <span className="text-neutral-9 group-hover:text-true-black">{symbol}</span>
                </>
              );
            })()}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProposalContentVoteSecondary;
