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

  const units = [];

  if (days > 0) {
    units.push(<TimeUnit key="days" value={days} unit="d" />);
  }

  if (hours > 0) {
    units.push(<TimeUnit key="hours" value={hours} unit="h" />);
  }

  units.push(<TimeUnit key="minutes" value={minutes} unit="m" />);
  units.push(<TimeUnit key="seconds" value={seconds} unit="s" />);

  return <div className="flex items-baseline gap-2">{units}</div>;
};

export default TimerDisplay;
