import { Fragment, useState } from "react";
import { Tooltip } from "react-tooltip";

type TabOption = {
  label: string;
  content: JSX.Element;
};

type TabProps = {
  options: TabOption[];
  defaultTab?: number;
  className?: string;
  disabledTab?: number;
  onSelectTab?: (tabIndex: number) => void;
};

const CreateTab: React.FC<TabProps> = ({ options, defaultTab = 0, className, disabledTab = -1, onSelectTab }) => {
  const [selectedTab, setSelectedTab] = useState<TabOption>(options[defaultTab]);

  const selectTab = (tab: TabOption, index: number) => {
    setSelectedTab(tab);
    onSelectTab && onSelectTab(index);
  };

  const isTabDisabled = (index: number) => index === disabledTab;

  return (
    <div>
      <div className={`flex justify-between items-end ${className}`}>
        {options.map((option, index) => (
          <Fragment key={index}>
            <div
              data-tooltip-id={`tooltip-${index}`}
              className={`flex-grow text-[18px] md:text-[24px] font-bold text-start md:text-center py-2 ${
                isTabDisabled(index) ? "cursor-not-allowed" : "cursor-pointer"
              } flex flex-col items-start ${selectedTab === options[index] ? "text-primary-10" : "text-neutral-9"} ${
                index === 0 ? "text-start md:text-center" : "text-end md:text-center"
              }`}
              onClick={() => !isTabDisabled(index) && selectTab(option, index)}
            >
              <p className="md:indent-6">{option.label}</p>
              <div
                className={`h-1 w-full mt-1 ${selectedTab === options[index] ? "bg-primary-10" : "bg-neutral-9"}`}
              ></div>
              {isTabDisabled(index) && (
                <Tooltip id={`tooltip-${index}`}>
                  <p className="text-[16px]">We are working on this feature, stay tuned!</p>
                </Tooltip>
              )}
            </div>
            {index !== options.length - 1 && (
              <div className="text-neutral-9 self-end flex flex-col items-center py-2">
                <span className="text-[16px] py-2">or</span>
                <div className="h-1 w-full flex">
                  <span className={`flex-grow ${selectedTab === options[0] ? "bg-primary-10" : "bg-neutral-9"}`}></span>
                  <span className={`flex-grow ${selectedTab === options[1] ? "bg-primary-10" : "bg-neutral-9"}`}></span>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className="mt-4">{selectedTab.content}</div>
    </div>
  );
};

export default CreateTab;
