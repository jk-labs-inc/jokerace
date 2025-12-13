import { ProcessedContest } from "lib/contests/types";
import { FC, useEffect, useState } from "react";
import { getContestTiming, getTimingUpdateInterval } from "../../helpers";
import { ContestTimingData, ContestTimingFormat } from "../../types";

interface ContestTimingProps {
  contest: ProcessedContest;
}

const getTextColorClass = (format: ContestTimingFormat): string => {
  if (format === "ended" || format === "canceled") return "text-neutral-10";
  return "text-neutral-11";
};

const ContestTiming: FC<ContestTimingProps> = ({ contest }) => {
  const [timing, setTiming] = useState<ContestTimingData | null>(() => getContestTiming(contest));

  useEffect(() => {
    const updateTiming = () => {
      setTiming(getContestTiming(contest));
    };

    updateTiming();

    const intervalTime = getTimingUpdateInterval(contest);
    const interval = setInterval(updateTiming, intervalTime);

    return () => clearInterval(interval);
  }, [contest]);

  if (!timing) return null;

  const textColorClass = getTextColorClass(timing.format);

  //TODO: update when voting opens within 24 hours to for example (tues 5pm - wed 5pm) instead of (tues, 5pm) as it is now
  return (
    <div className="flex items-center gap-1">
      ⏱️
      <p className={`text-xs font-bold ${textColorClass}`}>{timing.display}</p>
    </div>
  );
};

export default ContestTiming;
