import { ProcessedContest } from "lib/contests/types";
import { FC } from "react";
import Dot from "./components/Dot";
import { useContestStatusTimer } from "./hooks/useContestStatusTimer";

interface ContestStatusProps {
  contest: ProcessedContest;
  isAnyoneCanSubmit?: boolean;
}

const ContestStatus: FC<ContestStatusProps> = ({ contest, isAnyoneCanSubmit = false }) => {
  const contestState = useContestStatusTimer(contest, isAnyoneCanSubmit);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Dot color={contestState.color} />
        <p className="text-[16px] text-neutral-9">{contestState.text}</p>
      </div>
      <div className="text-[16px] text-neutral-9">
        {contestState.timeLeft && (
          <div>
            within <b>{contestState.timeLeft}</b>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestStatus;
