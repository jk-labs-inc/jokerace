import { FC, useEffect, useRef, useState } from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange?: (tab: string) => void;
  optionalInfo?: Record<string, number>;
}

const Tabs: FC<TabsProps> = ({ tabs, activeTab, onChange, optionalInfo }) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab === currentTab);
    const activeTabRef = tabRefs.current[activeTabIndex];

    if (activeTabRef) {
      setIndicatorStyle({
        left: `${activeTabRef.offsetLeft}px`,
        width: `${activeTabRef.offsetWidth}px`,
      });
    }
  }, [currentTab, tabs]);

  const onTabChange = (tab: string) => {
    setCurrentTab(tab);
    onChange?.(tab);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex gap-6 md:gap-8 mb-4">
        {tabs.map((tab, index) => (
          <div
            ref={(el: HTMLDivElement | null) => {
              tabRefs.current[index] = el;
            }}
            key={tab}
            className={`text-[16px] md:text-[24px] cursor-pointer font-bold transition-colors duration-300 ${
              tab === currentTab ? "text-neutral-11" : "text-neutral-10"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
            {optionalInfo?.[tab] !== undefined && <span className="text-[16px] ml-1">({optionalInfo[tab]})</span>}
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full h-1 bottom-0 bg-neutral-0"></div>
      <div style={indicatorStyle} className="absolute bottom-0 h-1 bg-positive-11 transition-all duration-300"></div>
    </div>
  );
};

export default Tabs;
