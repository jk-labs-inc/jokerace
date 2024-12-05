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
        <p className="text-[16px] text-secondary-11">good news: you qualify to enter this contest once it opens</p>
      );
    }
    if (!currentUserQualifiedToSubmit) {
      return <p className="text-[16px] text-secondary-11">you're not allowlisted to enter this contest</p>;
    }
  }

  if (contestStatus === ContestStatus.SubmissionOpen) {
    if (hasReachedMaxSubmissions) {
      return <p className="text-[16px] text-secondary-11">you’ve reached your max entries with this account</p>;
    }
    if (!currentUserQualifiedToSubmit) {
      if (canVote) {
        return (
          <p className="text-[16px] text-secondary-11">
            you're not allowlisted to enter this contest, but you can vote in it once voting opens
          </p>
        );
      }
      return <p className="text-[16px] text-secondary-11">you're not allowlisted to enter this contest</p>;
    }
  }

  return null;
};

export default SubmissionQualifierMessage;
