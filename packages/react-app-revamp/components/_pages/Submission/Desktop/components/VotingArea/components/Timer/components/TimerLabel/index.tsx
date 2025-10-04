import { FC } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

interface TimerLabelProps {
  label: string;
}

const TimerLabel: FC<TimerLabelProps> = ({ label }) => {
  return (
    <div className="flex items-center gap-2">
      <ClockIcon className="w-4 h-4 text-neutral-9" />
      <span className="text-[16px] font-bold text-neutral-9">{label}</span>
    </div>
  );
};

export default TimerLabel;
