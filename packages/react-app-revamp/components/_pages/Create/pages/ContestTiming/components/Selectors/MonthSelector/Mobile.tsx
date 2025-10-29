import { FC } from "react";
import MobileSelector from "../MobileSelector";
import { CreateContestTimingDropdownOption } from "../../Dropdown";

interface MobileMonthSelectorProps {
  months: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (month: string) => void;
}

const MobileMonthSelector: FC<MobileMonthSelectorProps> = ({ months, onChange, defaultValue }) => {
  return (
    <MobileSelector
      label="Select Month"
      value={defaultValue}
      options={months}
      onChange={onChange || (() => {})}
      width="w-[168px]"
    />
  );
};

export default MobileMonthSelector;
