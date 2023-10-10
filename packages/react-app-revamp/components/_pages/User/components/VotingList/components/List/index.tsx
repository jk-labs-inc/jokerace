import { chainsImages } from "@config/wagmi";
import { formatNumber } from "@helpers/formatNumber";
import { getProposalPagePath } from "@helpers/routing";
import { SubmissionWithContest } from "lib/user/types";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface UserVotesListProps {
  submission: SubmissionWithContest;
  isLoading: boolean;
}

const UserVotesList: FC<UserVotesListProps> = ({ submission, isLoading }) => {
  if (!submission.vote_amount) return null;

  return (
    <Link
      href={getProposalPagePath(submission.network_name, submission.contest_address, submission.proposal_id)}
      target="_blank"
    >
      <div
        className="flex items-center gap-6 border-t border-neutral-9 py-4 p-3 
          hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer text-[16px]"
      >
        <Image src={chainsImages[submission.network_name]} width={32} height={32} alt={""} />
        <p>
          The user cast <span className="text-positive-11 font-bold">{formatNumber(submission.vote_amount)}</span> vote
          {submission.vote_amount > 1 ? "s" : ""} for Proposal {submission.proposal_id.slice(0, 5)} in the{" "}
          {submission.contest.title} contest.
        </p>
      </div>
    </Link>
  );
};

export default UserVotesList;
