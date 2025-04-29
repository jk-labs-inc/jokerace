import { Proposal } from "@components/_pages/ProposalContent";
import { formatNumberAbbreviated } from "@helpers/formatNumber";
import { FC } from "react";

interface ProposalContentVotePrimaryProps {
  proposal: Proposal;
  handleVotingModalOpen?: () => void;
}

const ProposalContentVotePrimary: FC<ProposalContentVotePrimaryProps> = ({ proposal, handleVotingModalOpen }) => {
  return (
    <button
      onClick={handleVotingModalOpen}
      className="group min-w-16 flex-shrink-0 h-6 p-2 flex items-center justify-between gap-2 bg-gradient-vote hover:shadow-button-embossed-hover transition-all duration-200 rounded-[16px] cursor-pointer text-true-black"
    >
      <img src="/contest/upvote-2.svg" width={13} height={15} alt="upvote" className="flex-shrink-0" />
      <p className="text-[16px] font-bold flex-grow text-center">{formatNumberAbbreviated(proposal.votes)}</p>
    </button>
  );
};

export default ProposalContentVotePrimary;
