import { FC } from "react";
import MobileSelector from "../MobileSelector";
import { Option } from "@components/_pages/Create/components/DefaultDropdown";

interface MobileMonthSelectorProps {
  months: Option[];
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
