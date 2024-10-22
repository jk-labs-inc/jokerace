import { Proposal } from "@components/_pages/ProposalContent";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";

interface ProposalLayoutRankOrPlaceholderProps {
  proposal: Proposal;
  contestStatus: ContestStatus;
}

const ProposalLayoutRankOrPlaceholder: FC<ProposalLayoutRankOrPlaceholderProps> = ({ proposal, contestStatus }) => {
  if (proposal.rank) {
    if (proposal.rank === 1) {
      return (
        <img
          src="/contest/ranks/first.svg"
          alt="Rank 1"
          className="w-6 h-[29px] md:w-10 md:h-10 mt-[5px] object-contain"
        />
      );
    } else {
      return (
        <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
          <p className="text-[12px] md:text-[16px] text-neutral-11 font-bold">{proposal.rank}</p>
        </div>
      );
    }
  } else {
    const isContestOpen = contestStatus === ContestStatus.ContestOpen || contestStatus === ContestStatus.SubmissionOpen;
    const isVotingOpen = contestStatus === ContestStatus.VotingOpen;
    if (isContestOpen || isVotingOpen) {
      return (
        <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full  ${isContestOpen ? "bg-primary-10" : "bg-positive-11"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${isContestOpen ? "bg-primary-10" : "bg-positive-11"}`}
            ></span>
          </span>
        </div>
      );
    } else {
      return <div className="w-3 h-3 md:w-10 md:h-10 flex items-center justify-center" />;
    }
  }
};

export default ProposalLayoutRankOrPlaceholder;
