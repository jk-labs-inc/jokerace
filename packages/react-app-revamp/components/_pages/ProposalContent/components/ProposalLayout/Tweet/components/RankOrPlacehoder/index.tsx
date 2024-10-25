import { Proposal } from "@components/_pages/ProposalContent";
import { FC } from "react";

interface ProposalLayoutTweetRankOrPlaceholderProps {
  proposal: Proposal;
}

const ProposalLayoutTweetRankOrPlaceholder: FC<ProposalLayoutTweetRankOrPlaceholderProps> = ({ proposal }) => {
  if (proposal.rank) {
    if (proposal.rank === 1) {
      return <img src="/contest/ranks/first.svg" alt="Rank 1" className="w-10 h-10 object-contain" />;
    } else {
      return <p className="text-[16px] text-neutral-11 font-bold">{proposal.rank}</p>;
    }
  }
};

export default ProposalLayoutTweetRankOrPlaceholder;
