import { FC } from "react";

interface TimeUnitProps {
  value: number;
  label: string;
}

const ContestCountdownTimeUnit: FC<TimeUnitProps> = ({ value, label }) => (
  <>
    <span className="text-[16px] md:text-[24px] font-bold">{value}</span>
    <span className="text-[12px] md:text-[16px]">{label}</span>
  </>
);

export default ContestCountdownTimeUnit;
