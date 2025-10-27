import { FC } from "react";
import CreateContestTimingDropdown, { CreateContestTimingDropdownOption } from "../../Dropdown";

interface CreateContestTimingHourSelectorProps {
  hours: CreateContestTimingDropdownOption[];
  defaultValue: string;
  onChange?: (hour: string) => void;
}

const CreateContestTimingHourSelector: FC<CreateContestTimingHourSelectorProps> = ({
  hours,
  onChange,
  defaultValue,
}) => {
  return (
    <div className="flex items-center gap-4">
      <CreateContestTimingDropdown options={hours} width="w-[120px]" onChange={onChange} defaultValue={defaultValue} />
    </div>
  );
};

export default CreateContestTimingHourSelector;
