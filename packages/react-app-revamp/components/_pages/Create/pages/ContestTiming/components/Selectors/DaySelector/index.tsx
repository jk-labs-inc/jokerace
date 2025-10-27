import { FC } from "react";
import CreateContestTimingDropdown, { CreateContestTimingDropdownOption } from "../../Dropdown";
import MobileDaySelector from "./Mobile";
import { useMediaQuery } from "react-responsive";

interface CreateContestTimingDaySelectorProps {
  days: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (day: string) => void;
}

const CreateContestTimingDaySelector: FC<CreateContestTimingDaySelectorProps> = ({ days, onChange, defaultValue }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return <MobileDaySelector days={days} defaultValue={defaultValue} onChange={onChange} />;
  }
  return <CreateContestTimingDropdown options={days} width="w-24" onChange={onChange} defaultValue={defaultValue} />;
};

export default CreateContestTimingDaySelector;
