import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CreateContestParams from "../../../../pages/ContestParams";

const CreateContestRulesAdvancedSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex gap-4 items-center cursor-pointer">
        <p className="text-[20px] text-positive-11">advanced settings</p>
        <ChevronDownIcon
          className={`w-6 h-6 text-positive-11 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
      {isExpanded && (
        <div className="animate-reveal mt-6">
          <CreateContestParams />
        </div>
      )}
    </div>
  );
};

export default CreateContestRulesAdvancedSettings;
