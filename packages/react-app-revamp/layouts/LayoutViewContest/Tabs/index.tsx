import ShareDropdown from "@components/Share";
import { FC, ReactNode, useState } from "react";

export enum Tab {
  Contest = "Contest",
  Parameters = "Parameters",
  Rewards = "Rewards",
}

interface ContestLayoutTabsProps {
  contestAddress: string;
  chain: string;
  contestName: string;
  onChange?: (tab: Tab) => void;
}

const ContestLayoutTabs: FC<ContestLayoutTabsProps> = ({ contestAddress, chain, contestName, onChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Contest);

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-4 items-center">
        {Object.keys(Tab).map(tabKey => (
          <div
            key={tabKey}
            className={`text-[16px] cursor-pointer font-bold transition-colors duration-300 ${
              tabKey === activeTab ? "text-primary-10" : "text-neutral-11"
            }`}
            onClick={() => onTabChange(Tab[tabKey as keyof typeof Tab])}
          >
            {Tab[tabKey as keyof typeof Tab]}
          </div>
        ))}
        <div className="ml-auto z-20">
          <ShareDropdown contestAddress={contestAddress} chain={chain} contestName={contestName} />
        </div>
      </div>
    </div>
  );
};

export default ContestLayoutTabs;
