import { FC, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange?: (tab: string) => void;
  optionalInfo?: Record<string, number>;
}

const Tabs: FC<TabsProps> = ({ tabs, activeTab, onChange, optionalInfo }) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorLayout, setIndicatorLayout] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab === currentTab);
    const activeTabRef = tabRefs.current[activeTabIndex];

    if (activeTabRef) {
      setIndicatorLayout({
        left: activeTabRef.offsetLeft,
        width: activeTabRef.offsetWidth,
      });
    }
  }, [currentTab, tabs]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onChange?.(tab);
  };

  const activeColor = "#E5E5E5"; // neutral-11
  const inactiveColor = "#6A6A6A"; // neutral-10

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex gap-6 md:gap-8 mb-4">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            ref={(el: HTMLDivElement | null) => {
              tabRefs.current[index] = el;
            }}
            className="text-[16px] md:text-[24px] cursor-pointer relative"
            onClick={() => handleTabChange(tab)}
          >
            <motion.span
              initial={{
                color: tab === currentTab ? activeColor : inactiveColor,
                opacity: tab === currentTab ? 1 : 0.8,
              }}
              animate={{
                color: tab === currentTab ? activeColor : inactiveColor,
                opacity: tab === currentTab ? 1 : 0.8,
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                display: "block",
                fontWeight: tab === currentTab ? 600 : 400,
              }}
            >
              {tab}
              {optionalInfo?.[tab] !== undefined && <span className="text-[16px] ml-1">({optionalInfo[tab]})</span>}
            </motion.span>
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full h-[1px] bottom-0 bg-neutral-0"></div>
      <motion.div
        className="absolute bottom-0 h-[1px] bg-positive-11"
        animate={{
          left: indicatorLayout.left,
          width: indicatorLayout.width,
        }}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
          mass: 1.2,
          duration: 0.35,
        }}
        style={{ willChange: "transform" }}
      />
    </div>
  );
};

export default Tabs;
