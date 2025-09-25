import { FC } from "react";

interface TimeUnitProps {
  value: number;
  unit: "d" | "h" | "m" | "s";
}

const TimeUnit: FC<TimeUnitProps> = ({ value, unit }) => {
  // Format value to always show 2 digits for consistency
  const formattedValue = value.toString().padStart(2, "0");

  return (
    <span className="inline-flex items-baseline gap-0">
      <span className="text-[24px] font-bold text-neutral-11">{formattedValue}</span>
      <span className="text-[16px] font-normal text-neutral-11">{unit}</span>
    </span>
  );
};

export default TimeUnit;
