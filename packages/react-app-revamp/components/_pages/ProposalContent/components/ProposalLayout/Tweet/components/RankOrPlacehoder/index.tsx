import { Proposal } from "@components/_pages/ProposalContent";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";

interface ProposalLayoutTweetRankOrPlaceholderProps {
  proposal: Proposal;
}

const ProposalLayoutTweetRankOrPlaceholder: FC<ProposalLayoutTweetRankOrPlaceholderProps> = ({ proposal }) => {
  if (proposal.rank) {
    if (proposal.rank === 1) {
      return <img src="/contest/ranks/first.svg" alt="Rank 1" className="w-10 h-10 object-contain" />;
    } else {
      return (
        <div className="w-6 h-6 bg-primary-2 opacity-75 rounded-full flex items-center justify-center">
          <p
            className="text-neutral-11 text-center text-[16px] font-bold"
            style={{
              textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            }}
          >
            {proposal.rank}
          </p>
        </div>
      );
    }
  }
};

export default ProposalLayoutTweetRankOrPlaceholder;
