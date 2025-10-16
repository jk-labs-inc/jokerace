import { ProcessedContest } from "lib/contests/types";
import moment from "moment";

export enum ContestStateType {
  CANCELED = "canceled",
  FINISHED = "finished",
  VOTING = "voting",
  UPCOMING = "upcoming",
}
export type DotColor = "green" | "pink" | "purple" | "yellow";

export interface ContestState {
  type: ContestStateType;
  text: string;
  color: DotColor;
  timeLeft: string;
}

export const formatDuration = (duration: moment.Duration): string => {
  const totalDays = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  const parts: string[] = [];

  if (totalDays > 0) {
    parts.push(`${totalDays}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0) {
    parts.push(`${seconds}s`);
  }

  // If all parts are zero, show "0s"
  return parts.length > 0 ? parts.join(" ") : "0s";
};

export const getContestState = (contest: ProcessedContest): ContestState => {
  if (contest.isCanceled) {
    return {
      type: ContestStateType.CANCELED,
      text: "canceled",
      color: "pink",
      timeLeft: "",
    };
  }

  const now = moment();
  const voteStart = moment(contest.vote_start_at);
  const end = moment(contest.end_at);

  if (now.isAfter(end)) {
    return {
      type: ContestStateType.FINISHED,
      text: "finished",
      color: "purple",
      timeLeft: "",
    };
  }

  if (now.isBefore(voteStart)) {
    const duration = moment.duration(voteStart.diff(now));
    return {
      type: ContestStateType.UPCOMING,
      text: "voting opens in",
      color: "yellow",
      timeLeft: formatDuration(duration),
    };
  }

  if (now.isBefore(end)) {
    const duration = moment.duration(end.diff(now));
    return {
      type: ContestStateType.VOTING,
      text: "vote on entries",
      color: "green",
      timeLeft: formatDuration(duration),
    };
  }

  return {
    type: ContestStateType.FINISHED,
    text: "finished",
    color: "purple",
    timeLeft: "",
  };
};
