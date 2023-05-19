import { useState } from "react";
import { Tooltip } from "react-tooltip";

type TabOption = {
  label: string;
  content: JSX.Element;
};

type TabProps = {
  options: TabOption[];
  disabledTab?: number;
};

const CreateTab: React.FC<TabProps> = ({ options, disabledTab = -1 }) => {
  const [selectedTab, setSelectedTab] = useState<TabOption>(options[0]);

  const selectTab = (tab: TabOption) => {
    setSelectedTab(tab);
  };

  const isTabDisabled = (index: number) => index === disabledTab;

  return (
    <div>
      <div className="flex justify-between items-end w-[600px]">
        <div
          className={`flex-grow text-[24px] font-bold text-center py-2 cursor-pointer flex flex-col items-start ${
            selectedTab === options[0] ? "text-primary-10" : "text-neutral-9"
          }`}
          onClick={() => selectTab(options[0])}
        >
          <p className="indent-6">{options[0].label}</p>
          <div className={`h-1 w-full mt-1 ${selectedTab === options[0] ? "bg-primary-10" : "bg-neutral-9"}`}></div>
        </div>

        <div className=" text-neutral-9 self-end flex flex-col items-center py-2">
          <span className="text-[16px] py-2">or</span>
          <div className="h-1 w-full flex">
            <span className={`flex-grow ${selectedTab === options[0] ? "bg-primary-10" : "bg-neutral-9"}`}></span>
            <span className={`flex-grow ${selectedTab === options[1] ? "bg-primary-10" : "bg-neutral-9"}`}></span>
          </div>
        </div>

        <div
          data-tooltip-id="voting-requirements"
          className={`flex-grow text-[24px] font-bold text-center py-2 ${
            isTabDisabled(1) ? "cursor-not-allowed" : "cursor-pointer"
          } flex flex-col items-start ${selectedTab === options[1] ? "text-primary-10" : "text-neutral-9"}`}
          onClick={() => !isTabDisabled(1) && selectTab(options[1])}
        >
          <p className="indent-6">{options[1].label}</p>
          <div className={`h-1 w-full mt-1 ${selectedTab === options[1] ? "bg-primary-10" : "bg-neutral-9"}`}></div>
          {isTabDisabled(1) && (
            <Tooltip id="voting-requirements">
              <p className="text-[16px]">we are working on this feature, stay tuned!</p>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="mt-4">{selectedTab.content}</div>
    </div>
  );
};

export default CreateTab;
