import Tabs from "@components/UI/Tabs";
import { FC } from "react";

export enum Tab {
  Contest = "Contest",
  Parameters = "Parameters",
  Rewards = "my rewards",
  Extensions = "Extensions",
}

interface ContestTabsProps {
  tab: Tab;
  onChange?: (tab: Tab) => void;
}

const ContestTabs: FC<ContestTabsProps> = ({ tab, onChange }) => {
  const tabs = Object.values(Tab);

  const handleChange = (selectedTab: string) => {
    onChange?.(selectedTab as Tab);
  };

  return <Tabs tabs={tabs} activeTab={tab} onChange={handleChange} />;
};

export default ContestTabs;
