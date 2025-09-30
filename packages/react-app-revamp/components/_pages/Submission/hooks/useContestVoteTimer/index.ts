import { useState, useEffect, useRef } from "react";
import { Abi } from "viem";
import moment from "moment";
import useContestVoteDeadline from "../useContestVoteDeadline";

interface ContestVoteTimerProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
}

export enum VotingStatus {
  VotingNotOpen = "VotingNotOpen",
  VotingOpen = "VotingOpen",
  VotingClosed = "VotingClosed",
}

interface ContestVoteTimerReturn {
  votingStatus: VotingStatus;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null;
  isVotingOpen: boolean;
  isLoading: boolean;
  isError: boolean;
}

/**
 * This hook provides live countdown timer for contest voting phase.
 * It returns the current voting status and countdown to next phase transition.
 * Following Dan Abramov's approach for declarative timers:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
const useContestVoteTimer = ({
  contestAddress,
  contestChainId,
  contestAbi,
}: ContestVoteTimerProps): ContestVoteTimerReturn => {
  const { voteStart, contestDeadline, isLoading, isError } = useContestVoteDeadline({
    contestAddress,
    contestChainId,
    contestAbi,
  });

  const [votingStatus, setVotingStatus] = useState<VotingStatus>(VotingStatus.VotingNotOpen);
  const [timeRemaining, setTimeRemaining] = useState<ContestVoteTimerReturn["timeRemaining"]>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPreviousInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const calculateTimeRemaining = (targetDate: moment.Moment) => {
    const now = moment();
    const diff = targetDate.diff(now);

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      };
    }

    const duration = moment.duration(diff);
    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
      totalSeconds: Math.floor(diff / 1000),
    };
  };

  const updateTimer = () => {
    if (!voteStart || !contestDeadline) return;

    const now = moment();
    const voteStartMoment = moment.unix(Number(voteStart));
    const contestDeadlineMoment = moment.unix(Number(contestDeadline));

    let newStatus: VotingStatus;
    let targetDate: moment.Moment | null = null;

    if (now.isBefore(voteStartMoment)) {
      // Voting hasn't started yet
      newStatus = VotingStatus.VotingNotOpen;
      targetDate = voteStartMoment;
    } else if (now.isBefore(contestDeadlineMoment)) {
      // Voting is currently open
      newStatus = VotingStatus.VotingOpen;
      targetDate = contestDeadlineMoment;
    } else {
      // Voting has ended
      newStatus = VotingStatus.VotingClosed;
      targetDate = null;
    }

    setVotingStatus(newStatus);

    if (targetDate) {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(remaining);

      // Stop the timer when we reach zero
      if (remaining.totalSeconds <= 0) {
        clearPreviousInterval();
        // Trigger one more update to transition to next phase
        setTimeout(updateTimer, 100);
      }
    } else {
      setTimeRemaining(null);
    }
  };

  useEffect(() => {
    if (isLoading || !voteStart || !contestDeadline) {
      return;
    }

    // Initial update
    updateTimer();

    // Set up interval for live countdown (update every second)
    intervalRef.current = setInterval(updateTimer, 1000);

    return clearPreviousInterval;
  }, [voteStart, contestDeadline, isLoading]);

  return {
    votingStatus,
    timeRemaining,
    isVotingOpen: votingStatus === VotingStatus.VotingOpen,
    isLoading,
    isError,
  };
};

export default useContestVoteTimer;
