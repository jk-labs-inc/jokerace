import { FC } from "react";
import CreateContestTimingDropdown, { CreateContestTimingDropdownOption } from "../../Dropdown";
import MobileHourSelector from "./Mobile";
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return <MobileHourSelector hours={hours} defaultValue={defaultValue} onChange={onChange} />;
  }

  return (
    <div className="flex items-center gap-4">
      <CreateContestTimingDropdown options={hours} width="w-[120px]" onChange={onChange} defaultValue={defaultValue} />
    </div>
  );
};

export default CreateContestTimingHourSelector;
