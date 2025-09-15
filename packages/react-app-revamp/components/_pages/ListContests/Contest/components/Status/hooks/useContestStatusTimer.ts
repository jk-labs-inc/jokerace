import { useEffect, useRef, useState } from "react";
import { ProcessedContest } from "lib/contests/types";
import { ContestState, getContestState } from "../helpers";

export const useContestStatusTimer = (
  contest: ProcessedContest,
  isCreatorSubmitEntry: boolean = false,
): ContestState => {
  const [contestState, setContestState] = useState<ContestState>(() => getContestState(contest, isCreatorSubmitEntry));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      setContestState(getContestState(contest, isCreatorSubmitEntry));
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
  }, [contest.start_at, contest.vote_start_at, contest.end_at, contest.isCanceled, isCreatorSubmitEntry]);

  return contestState;
};
