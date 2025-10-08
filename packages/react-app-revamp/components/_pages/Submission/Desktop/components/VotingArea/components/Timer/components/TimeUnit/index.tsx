import { FC } from "react";

interface TimeUnitProps {
  value: number;
  unit: "d" | "h" | "m" | "s";
}

const TimeUnit: FC<TimeUnitProps> = ({ value, unit }) => {
  // TODO: check with david about logic here, why he has 03 in the time units (we can do afterwards)
  return (
    <span className="inline-flex items-baseline gap-0">
      <span className="text-[24px] font-bold text-neutral-11">{value}</span>
      <span className="text-[16px] font-normal text-neutral-11">{unit}</span>
    </span>
  );
};

export default TimeUnit;
