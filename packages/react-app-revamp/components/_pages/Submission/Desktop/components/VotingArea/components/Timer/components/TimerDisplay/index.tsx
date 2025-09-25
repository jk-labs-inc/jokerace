import { FC } from "react";
import TimeUnit from "../TimeUnit";

interface TimerDisplayProps {
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const TimerDisplay: FC<TimerDisplayProps> = ({ timeRemaining }) => {
  const { days, hours, minutes, seconds } = timeRemaining;

  return (
    <div className="flex items-baseline gap-2">
      <TimeUnit value={days} unit="d" />
      <TimeUnit value={hours} unit="h" />
      <TimeUnit value={minutes} unit="m" />
      <TimeUnit value={seconds} unit="s" />
    </div>
  );
};

export default TimerDisplay;
