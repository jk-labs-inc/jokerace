import { ContestStatus } from "@hooks/useContestStatus/store";
import { EMPTY_ROOT } from "@hooks/useUser";
import { FC } from "react";

interface SubmissionQualifierMessageProps {
  submissionMerkleRoot: string;
  currentUserQualifiedToSubmit: boolean;
  currentUserAvailableVotesAmount: number;
  currentUserProposalCount: number;
  contestMaxNumberSubmissionsPerUser: number;
  contestStatus: ContestStatus;
}

const SubmissionQualifierMessage: FC<SubmissionQualifierMessageProps> = ({
  submissionMerkleRoot,
  currentUserQualifiedToSubmit,
  currentUserAvailableVotesAmount,
  currentUserProposalCount,
  contestMaxNumberSubmissionsPerUser,
  contestStatus,
}) => {
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;
  const isContestOpen = contestStatus === ContestStatus.ContestOpen;
  const hasReachedMaxSubmissions = currentUserProposalCount >= contestMaxNumberSubmissionsPerUser;
  const canSubmit = anyoneCanSubmit || currentUserQualifiedToSubmit;
  const canVote = currentUserAvailableVotesAmount > 0;

  if (isContestOpen) {
    if (canSubmit) {
      return (
        <p className="text-[16px] text-primary-10">
          good news: you qualify to submit a response once the contest opens
        </p>
      );
    }
    if (!currentUserQualifiedToSubmit) {
      return (
        <p className="text-[16px] text-primary-10">
          unfortunately, your wallet wasn’t allowlisted to submit in this contest.
        </p>
      );
    }
  }

  if (contestStatus === ContestStatus.SubmissionOpen) {
    if (hasReachedMaxSubmissions) {
      return <p className="text-[16px] text-primary-10">you’ve reached your max submissions with this account</p>;
    }
    if (!currentUserQualifiedToSubmit) {
      if (canVote) {
        return (
          <p className="text-[16px] text-primary-10">
            unfortunately, your wallet wasn’t allowlisted to submit in this contest, but you <i>were</i> allowlisted to
            vote
          </p>
        );
      }
      return (
        <p className="text-[16px] text-primary-10">
          unfortunately, your wallet wasn’t allowlisted to submit in this contest.
        </p>
      );
    }
  }

  return null;
};

export default SubmissionQualifierMessage;
