import { FC } from "react";
import PeriodSelectorButton from "./components/Button";

export enum Period {
  AM = "AM",
  PM = "PM",
}

interface PeriodSelectorProps {
  value: Period;
  onChange?: (period: Period) => void;
}

const PeriodSelector: FC<PeriodSelectorProps> = ({ value, onChange }) => {
  const handlePeriodChange = (period: Period) => {
    onChange?.(period);
  };

  return (
    <div className="flex gap-1 w-28 h-10 items-center justify-center px-1 rounded-full bg-neutral-9 border border-primary-5">
      <PeriodSelectorButton isSelected={value === Period.AM} onClick={() => handlePeriodChange(Period.AM)}>
        AM
      </PeriodSelectorButton>
      <PeriodSelectorButton isSelected={value === Period.PM} onClick={() => handlePeriodChange(Period.PM)}>
        PM
      </PeriodSelectorButton>
    </div>
  );
};

export default PeriodSelector;
