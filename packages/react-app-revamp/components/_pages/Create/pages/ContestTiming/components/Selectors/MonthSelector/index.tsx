import CreateDefaultDropdown, { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import MobileMonthSelector from "./Mobile";

interface CreateContestTimingMonthSelectorProps {
  months: Option[];
  defaultValue: string;
  onChange?: (month: string) => void;
}

const CreateContestTimingMonthSelector: FC<CreateContestTimingMonthSelectorProps> = ({
  months,
  onChange,
  defaultValue,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return <MobileMonthSelector months={months} defaultValue={defaultValue} onChange={onChange} />;
  }
  return <CreateDefaultDropdown options={months} width="w-[168px]" onChange={onChange} defaultValue={defaultValue} />;
};

export default CreateContestTimingMonthSelector;
