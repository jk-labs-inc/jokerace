import { FC } from "react";
import MobileSelector from "../MobileSelector";
import { CreateContestTimingDropdownOption } from "../../Dropdown";

interface MobileDaySelectorProps {
  days: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (day: string) => void;
}

const MobileDaySelector: FC<MobileDaySelectorProps> = ({ days, onChange, defaultValue }) => {
  return (
    <MobileSelector
      label="Select Day"
      value={defaultValue}
      options={days}
      onChange={onChange || (() => {})}
      width="w-24"
    />
  );
};

export default MobileDaySelector;
