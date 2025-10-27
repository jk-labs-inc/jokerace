import { FC } from "react";
import PeriodSelectorButton from "./components/Button";
import { Period } from "@hooks/useDeployContest/slices/contestTimingSlice";

interface PeriodSelectorProps {
  value: Period;
  layoutId?: string;
  onChange?: (period: Period) => void;
}

const PeriodSelector: FC<PeriodSelectorProps> = ({ value, onChange, layoutId = "selected-period" }) => {
  const handlePeriodChange = (period: Period) => {
    onChange?.(period);
  };

  return (
    <div className="flex gap-1 w-28 h-10 items-center justify-center px-1 rounded-full bg-neutral-9 border border-primary-5">
      <PeriodSelectorButton
        isSelected={value === Period.AM}
        onClick={() => handlePeriodChange(Period.AM)}
        layoutId={layoutId}
      >
        AM
      </PeriodSelectorButton>
      <PeriodSelectorButton
        isSelected={value === Period.PM}
        onClick={() => handlePeriodChange(Period.PM)}
        layoutId={layoutId}
      >
        PM
      </PeriodSelectorButton>
    </div>
  );
};

export default PeriodSelector;
