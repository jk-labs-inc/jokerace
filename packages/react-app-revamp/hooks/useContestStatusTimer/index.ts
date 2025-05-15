import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { ContestStatus } from "@hooks/useContestStatus/store";

interface ContestTimeline {
  submissionsOpen: Date;
  votesOpen: Date;
  votesClose: Date;
  isLoading: boolean;
}

/**
 * This hook is used to get the current status of the contest.
 * It returns the current status of the contest.
 * It also schedules future status updates.
 * We are using Dan Abramov's blog post on how to implement a timer in React:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param submissionsOpen - The date when the submissions open.
 * @param votesOpen - The date when the voting opens.
 * @param votesClose - The date when the voting closes.
 * @param isLoading - Whether the contest is loading.
 * @returns The current status of the contest.
 */
export const useContestStatusTimer = ({
  submissionsOpen,
  votesOpen,
  votesClose,
  isLoading,
}: ContestTimeline): ContestStatus => {
  const [status, setStatus] = useState<ContestStatus>(ContestStatus.ContestOpen);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearPreviousTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const updateStatus = () => {
      const now = moment();
      const formattedSubmissionOpen = moment(submissionsOpen);
      const formattedVotingOpen = moment(votesOpen);
      const formattedVotingClose = moment(votesClose);

      let newStatus: ContestStatus;
      let nextDate: moment.Moment | null = null;

      if (now.isBefore(formattedSubmissionOpen)) {
        newStatus = ContestStatus.ContestOpen;
        nextDate = formattedSubmissionOpen;
      } else if (now.isBefore(formattedVotingOpen)) {
        newStatus = ContestStatus.SubmissionOpen;
        nextDate = formattedVotingOpen;
      } else if (now.isBefore(formattedVotingClose)) {
        newStatus = ContestStatus.VotingOpen;
        nextDate = formattedVotingClose;
      } else {
        newStatus = ContestStatus.VotingClosed;
        nextDate = null;
      }

      setStatus(newStatus);

      if (nextDate) {
        const msUntilNext = nextDate.diff(now);
        timeoutRef.current = setTimeout(updateStatus, msUntilNext);
      }
    };

    updateStatus();

    return clearPreviousTimeout;
  }, [submissionsOpen, votesOpen, votesClose, isLoading]);

  return status;
};
