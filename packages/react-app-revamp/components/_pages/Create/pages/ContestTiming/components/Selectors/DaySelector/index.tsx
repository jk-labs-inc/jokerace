import { FC } from "react";
import CreateContestTimingDropdown, { CreateContestTimingDropdownOption } from "../../Dropdown";

interface CreateContestTimingDaySelectorProps {
  days: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (day: string) => void;
}

const CreateContestTimingDaySelector: FC<CreateContestTimingDaySelectorProps> = ({ days, onChange, defaultValue }) => {
  return <CreateContestTimingDropdown options={days} width="w-24" onChange={onChange} defaultValue={defaultValue} />;
};

export default CreateContestTimingDaySelector;
