import { useEffect, useRef, useState } from "react";
import { ProcessedContest } from "lib/contests/types";
import { ContestState, getContestState } from "../helpers";

export const useContestStatusTimer = (contest: ProcessedContest): ContestState => {
  const [contestState, setContestState] = useState<ContestState>(() => getContestState(contest));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      setContestState(getContestState(contest));
    };

    updateStatus();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(updateStatus, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [contest.vote_start_at, contest.end_at, contest.isCanceled]);

  return contestState;
};
