import { FC, useEffect, useRef, useState } from "react";

export enum Tab {
  Contest = "Contest",
  Parameters = "Parameters",
  Rewards = "Rewards",
  Extensions = "Extensions",
}

interface ContestTabsProps {
  tab: Tab;
  onChange?: (tab: Tab) => void;
}

const ContestTabs: FC<ContestTabsProps> = ({ tab, onChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>(tab);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeTabIndex = Object.keys(Tab).findIndex(key => key === activeTab);
    const activeTabRef = tabRefs.current[activeTabIndex];

    if (activeTabRef) {
      setIndicatorStyle({
        left: `${activeTabRef.offsetLeft}px`,
        width: `${activeTabRef.offsetWidth}px`,
      });
    }
  }, [activeTab]);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex gap-6 md:gap-8 mb-4">
        {Object.keys(Tab).map((tabKey, index) => (
          <div
            ref={(el: HTMLDivElement | null) => {
              tabRefs.current[index] = el;
            }}
            key={tabKey}
            className={`text-[16px] md:text-[24px] cursor-pointer font-bold transition-colors duration-200 ${
              tabKey === activeTab ? "text-primary-10" : "text-neutral-11"
            }`}
            onClick={() => onTabChange(Tab[tabKey as keyof typeof Tab])}
          >
            {Tab[tabKey as keyof typeof Tab]}
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full h-1 bottom-0 bg-neutral-0"></div>
      <div style={indicatorStyle} className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"></div>
    </div>
  );
};

export default ContestTabs;
