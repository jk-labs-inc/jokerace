import { FC } from "react";
import MobileSelector from "../MobileSelector";
import { CreateContestTimingDropdownOption } from "../../Dropdown";

interface MobileHourSelectorProps {
  hours: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (hour: string) => void;
}

const MobileHourSelector: FC<MobileHourSelectorProps> = ({ hours, onChange, defaultValue }) => {
  return (
    <MobileSelector
      label="Select Hour"
      value={defaultValue}
      options={hours}
      onChange={onChange || (() => {})}
      width="w-[120px]"
    />
  );
};

export default MobileHourSelector;
