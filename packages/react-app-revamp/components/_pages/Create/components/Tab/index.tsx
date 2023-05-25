import { useState } from "react";
import { Tooltip } from "react-tooltip";

type TabOption = {
  label: string;
  content: JSX.Element;
};

type TabProps = {
  options: TabOption[];
  defaultTab?: number;
  width?: number;
  disabledTab?: number;
  onSelectTab?: (tabIndex: number) => void; // adding callback prop
};

const CreateTab: React.FC<TabProps> = ({
  options,
  defaultTab = 0,
  width = 600,
  disabledTab = -1,
  onSelectTab, // receiving callback prop
}) => {
  const [selectedTab, setSelectedTab] = useState<TabOption>(options[defaultTab]);

  const selectTab = (tab: TabOption, index: number) => {
    setSelectedTab(tab);
    onSelectTab && onSelectTab(index);
  };

  const isTabDisabled = (index: number) => index === disabledTab;

  return (
    <div>
      <div className="flex justify-between items-end" style={{ width: `${width}px` }}>
        {options.map((option, index) => (
          <div
            key={index}
            data-tooltip-id="voting-requirements"
            className={`flex-grow text-[24px] font-bold text-center py-2 ${
              isTabDisabled(index) ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-start ${selectedTab === options[index] ? "text-primary-10" : "text-neutral-9"}`}
            onClick={() => !isTabDisabled(index) && selectTab(option, index)}
          >
            <p className="indent-6">{option.label}</p>
            <div
              className={`h-1 w-full mt-1 ${selectedTab === options[index] ? "bg-primary-10" : "bg-neutral-9"}`}
            ></div>
            {isTabDisabled(index) && (
              <Tooltip id="voting-requirements">
                <p className="text-[16px]">We are working on this feature, stay tuned!</p>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">{selectedTab.content}</div>
    </div>
  );
};

export default CreateTab;
