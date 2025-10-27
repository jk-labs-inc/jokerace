import { FC } from "react";
import CreateContestTimingDropdown, { CreateContestTimingDropdownOption } from "../../Dropdown";

interface CreateContestTimingMonthSelectorProps {
  months: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (month: string) => void;
}

const CreateContestTimingMonthSelector: FC<CreateContestTimingMonthSelectorProps> = ({
  months,
  onChange,
  defaultValue,
}) => {
  return (
    <CreateContestTimingDropdown options={months} width="w-[168px]" onChange={onChange} defaultValue={defaultValue} />
  );
};

export default CreateContestTimingMonthSelector;
