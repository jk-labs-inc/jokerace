import { ProcessedContest } from "lib/contests/types";
import moment from "moment";

export type ContestStateType = "canceled" | "finished" | "voting" | "entry" | "upcoming";
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

export const getContestState = (contest: ProcessedContest, isAnyoneCanSubmit: boolean = false): ContestState => {
  if (contest.isCanceled) {
    return {
      type: "canceled",
      text: "canceled",
      color: "pink",
      timeLeft: "",
    };
  }

  const now = moment();
  const start = moment(contest.start_at);
  const voteStart = moment(contest.vote_start_at);
  const end = moment(contest.end_at);

  if (now.isAfter(end)) {
    return {
      type: "finished",
      text: "finished",
      color: "purple",
      timeLeft: "",
    };
  }

  if (now.isBefore(start)) {
    const duration = moment.duration(start.diff(now));
    return {
      type: "upcoming",
      text: `opens in ${formatDuration(duration)}`,
      color: "yellow",
      timeLeft: "",
    };
  }

  if (now.isBefore(voteStart)) {
    const duration = moment.duration(voteStart.diff(now));
    return {
      type: "entry",
      text: isAnyoneCanSubmit ? "submit an entry" : "creator submit entries",
      color: "green",
      timeLeft: formatDuration(duration),
    };
  }

  if (now.isBefore(end)) {
    const duration = moment.duration(end.diff(now));
    return {
      type: "voting",
      text: "vote on entries",
      color: "green",
      timeLeft: formatDuration(duration),
    };
  }

  return {
    type: "finished",
    text: "finished",
    color: "purple",
    timeLeft: "",
  };
};
