/* eslint-disable react/no-unescaped-entities */
import { formatNumber } from "@helpers/formatNumber";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { FC } from "react";

interface VotingQualifierMessageProps {
  currentUserTotalVotesAmount: number;
  currentUserAvailableVotesAmount: number;
  contestStatus: ContestStatus;
  isMobile: boolean;
  isReadOnly: boolean;
}

const VotingQualifierMessage: FC<VotingQualifierMessageProps> = ({
  currentUserTotalVotesAmount,
  currentUserAvailableVotesAmount,
  contestStatus,
  isMobile,
  isReadOnly,
}) => {
  const canVote = currentUserAvailableVotesAmount > 0;
  const votingOpen = contestStatus === ContestStatus.VotingOpen;
  const outOfVotes = currentUserTotalVotesAmount > 0 && !canVote;

  if (isReadOnly) return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">vote is in read mode</p>;

  if (canVote && votingOpen) {
    return (
      <p className="text-[16px] md:text-[24px] text-neutral-11 font-bold">
        {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount > 0 ? "s" : ""} left
      </p>
    );
  }

  if (canVote) {
    return (
      <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">
        {formatNumber(currentUserAvailableVotesAmount)} vote{currentUserAvailableVotesAmount > 0 ? "s" : ""}{" "}
        {isMobile ? "to use" : "to deploy"}
      </p>
    );
  }

  if (outOfVotes) return <p className="text-[16px] md:text-[24px] text-neutral-9 font-bold">you're out of votes :(</p>;

  if (!canVote) return <p className="text-[16px] md:text-[24px] text-primary-10 font-bold">ineligible to vote</p>;

  return null;
};

export default VotingQualifierMessage;
