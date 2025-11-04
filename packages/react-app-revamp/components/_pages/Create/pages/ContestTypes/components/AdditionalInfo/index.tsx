import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";

interface CreateContestTypesAdditionalInfoProps {
  children: React.ReactNode;
}

const CreateContestTypesAdditionalInfo: FC<CreateContestTypesAdditionalInfoProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex gap-1 items-center cursor-pointer">
        <p className="text-[16px] text-positive-11">how it works</p>
        <ChevronDownIcon
          className={`w-6 h-6 text-positive-11 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
      {isExpanded && <div className="animate-fade-in">{children}</div>}
    </div>
  );
};

export default CreateContestTypesAdditionalInfo;
