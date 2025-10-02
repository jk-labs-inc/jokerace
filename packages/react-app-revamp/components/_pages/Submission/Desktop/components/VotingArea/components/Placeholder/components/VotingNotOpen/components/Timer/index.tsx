import { FC } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

interface TimerProps {
  timeRemaining: TimeRemaining;
}

const Timer: FC<TimerProps> = ({ timeRemaining }) => {
  const formatTimeValue = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  const timeUnits = [
    { value: timeRemaining.days, label: "DAYS", format: false },
    { value: timeRemaining.hours, label: "HOURS", format: true },
    { value: timeRemaining.minutes, label: "MINUTES", format: true },
    { value: timeRemaining.seconds, label: "SECONDS", format: true },
  ];

  return (
    <div className="flex gap-4">
      {timeUnits.map(unit => (
        <div
          key={unit.label}
          className="w-[88px] h-[88px] border border-neutral-10 rounded-2xl flex flex-col items-center justify-center"
        >
          <span className="font-sabo-filled text-neutral-11 text-[32px] leading-none">
            {unit.format ? formatTimeValue(unit.value) : unit.value}
          </span>
          <span className="text-neutral-11 font-sabo-regular text-[16px] mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Timer;
