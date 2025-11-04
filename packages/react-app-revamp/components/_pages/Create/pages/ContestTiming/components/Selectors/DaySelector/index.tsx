import { FC } from "react";
import MobileDaySelector from "./Mobile";
import { useMediaQuery } from "react-responsive";
import CreateDefaultDropdown, { Option } from "@components/_pages/Create/components/DefaultDropdown";

interface CreateContestTimingDaySelectorProps {
  days: Option[];
  defaultValue: string;
  onChange?: (day: string) => void;
}

const CreateContestTimingDaySelector: FC<CreateContestTimingDaySelectorProps> = ({ days, onChange, defaultValue }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return <MobileDaySelector days={days} defaultValue={defaultValue} onChange={onChange} />;
  }
  return <CreateDefaultDropdown options={days} width="w-24" onChange={onChange} defaultValue={defaultValue} />;
};

export default CreateContestTimingDaySelector;
