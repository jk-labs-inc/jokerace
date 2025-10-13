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

enum Label {
  DAYS = "DAYS",
  HOURS = "HOURS",
  MINUTES = "MINUTES",
  SECONDS = "SECONDS",
}

const singularLabels: Record<Label, string> = {
  [Label.DAYS]: "DAY",
  [Label.HOURS]: "HOUR",
  [Label.MINUTES]: "MINUTE",
  [Label.SECONDS]: "SECOND",
};

const timeUnits = (timeRemaining: TimeRemaining) => [
  { value: timeRemaining.days, label: Label.DAYS, format: false },
  { value: timeRemaining.hours, label: Label.HOURS, format: true },
  { value: timeRemaining.minutes, label: Label.MINUTES, format: true },
  { value: timeRemaining.seconds, label: Label.SECONDS, format: true },
];

const Timer: FC<TimerProps> = ({ timeRemaining }) => {
  const formatTimeValue = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  const getLabel = (label: Label, value: number): string => {
    return value === 1 ? singularLabels[label] : label;
  };

  // Filter units to show: only show units with values greater than 0
  // Always show seconds if there are other time units present
  const allUnits = timeUnits(timeRemaining);
  const hasOtherUnits = timeRemaining.days > 0 || timeRemaining.hours > 0 || timeRemaining.minutes > 0;
  const visibleUnits = allUnits.filter(unit => unit.value > 0 || (unit.label === Label.SECONDS && hasOtherUnits));

  // If only seconds remain, show without box
  if (visibleUnits.length === 1 && visibleUnits[0].label === Label.SECONDS) {
    return (
      <div className="flex flex-col items-center justify-center">
        <span className="font-sabo-filled text-neutral-11 text-[32px] leading-none">
          {formatTimeValue(timeRemaining.seconds)}
        </span>
        <span className="text-neutral-11 font-sabo-regular text-[16px] mt-1">
          {getLabel(Label.SECONDS, timeRemaining.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full">
      {visibleUnits.map(unit => (
        <div
          key={unit.label}
          className="flex-1 h-[88px] border border-neutral-10 rounded-2xl flex flex-col items-center justify-center"
        >
          <span className="font-sabo-filled text-neutral-11 text-[32px] leading-none">
            {unit.format ? formatTimeValue(unit.value) : unit.value}
          </span>
          <span className="text-neutral-11 font-sabo-regular text-[16px] mt-1">{getLabel(unit.label, unit.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default Timer;
