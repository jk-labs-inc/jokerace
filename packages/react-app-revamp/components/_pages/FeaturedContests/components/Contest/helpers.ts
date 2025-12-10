import { ProcessedContest } from "lib/contests/types";
import moment from "moment";

export interface ContestStatus {
  status: string;
  timeLeft: string;
}

export const formatDuration = (duration: moment.Duration): string => {
  const totalDays = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (totalDays > 0) {
    return `${totalDays}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getContestStatus = (contest: ProcessedContest): ContestStatus => {
  const now = moment();
  const voteStart = moment(contest.vote_start_at);
  const end = moment(contest.end_at);

  if (now.isBefore(voteStart)) {
    const duration = moment.duration(voteStart.diff(now));
    return {
      status: "voting opens in",
      timeLeft: formatDuration(duration),
    };
  } else if (now.isBefore(end)) {
    const duration = moment.duration(end.diff(now));
    return {
      status: "Voting closes in",
      timeLeft: formatDuration(duration),
    };
  }
  return { status: "Contest ended", timeLeft: "" };
};

export const getUpdateInterval = (contestData: ProcessedContest): number => {
  const now = moment();
  let nextUpdate = moment(contestData.end_at);

  if (contestData.vote_start_at && now.isBefore(contestData.vote_start_at)) {
    nextUpdate = moment(contestData.vote_start_at);
  }

  const duration = moment.duration(nextUpdate.diff(now));
  const days = duration.asDays();
  const hours = duration.asHours();

  if (days > 1) {
    return 60 * 60 * 1000; // Update every hour
  } else if (hours > 1) {
    return 60 * 1000; // Update every minute
  }
  return 1000; // Update every second
};
