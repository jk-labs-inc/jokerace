/* eslint-disable react/no-unescaped-entities */
import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { AdvancedOptions } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";

interface ContestParamsAdvancedOptionsProps {
  advancedOptions: AdvancedOptions;
  onDownvotingAllowedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortingAllowedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContestParamsAdvancedOptions: FC<ContestParamsAdvancedOptionsProps> = ({
  advancedOptions,
  onDownvotingAllowedChange,
  onSortingAllowedChange,
}) => {
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-6 cursor-pointer w-64" onClick={() => setIsAdvancedOptionsOpen(!isAdvancedOptionsOpen)}>
        <p
          className={`text-[20px] md:text-[24px] ${
            isAdvancedOptionsOpen ? "text-primary-10" : "text-neutral-9"
          }  font-bold`}
        >
          advanced options
        </p>
        <button
          className={`transition-transform duration-500 ease-in-out transform ${
            isAdvancedOptionsOpen ? "" : "rotate-180"
          }`}
        >
          <ChevronUpIcon height={26} className={`${isAdvancedOptionsOpen ? "text-primary-10" : "text-neutral-9"}`} />
        </button>
      </div>
      <Collapsible isOpen={isAdvancedOptionsOpen}>
        <div className="flex flex-col gap-6 w-80">
          <p className="text-[14px]">
            note: you can't use the rewards module in your contest if you enable any of the advanced settings.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <p
                  className={` text-[16px] md:text-[24px]  ${
                    advancedOptions.downvote ? "text-neutral-11" : "text-neutral-9"
                  }`}
                >
                  enable downvoting
                </p>
                <label className="checkbox-container mt-[6px]">
                  <input type="checkbox" checked={advancedOptions.downvote} onChange={onDownvotingAllowedChange} />
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <p
                  className={` text-[16px] md:text-[24px]  ${
                    advancedOptions.sorting ? "text-neutral-11" : "text-neutral-9"
                  }`}
                >
                  enable sorting
                </p>
                <label className="checkbox-container mt-[6px]">
                  <input type="checkbox" checked={advancedOptions.sorting} onChange={onSortingAllowedChange} />
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default ContestParamsAdvancedOptions;
