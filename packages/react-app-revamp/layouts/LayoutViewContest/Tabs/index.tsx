import ShareDropdown from "@components/Share";
import { FC, ReactNode, useState } from "react";

const tabs = [
  {
    title: "Contest",
    content: "",
  },
  {
    title: "parameters",
    content: "Parameters Content",
  },
  {
    title: "rewards",
    content: "Rewards Content",
  },
];

interface ContestLayoutTabsProps {
  contestAddress: string;
  chain: string;
  contestName: string;
}

const ContestLayoutTabs: FC<ContestLayoutTabsProps> = ({ contestAddress, chain, contestName }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].title);

  const renderContent = (tab: { title: any; content: ReactNode }) => {
    if (tab.title === activeTab) {
      return <div>{tab.content}</div>;
    }
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-4 items-center">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`text-[16px] cursor-pointer  font-bold ${
              tab.title === activeTab ? "text-primary-10" : "text-neutral-11"
            }`}
            onClick={() => setActiveTab(tab.title)}
          >
            {tab.title}
          </div>
        ))}
        <div className="ml-auto z-20">
          <ShareDropdown contestAddress={contestAddress} chain={chain} contestName={contestName} />
        </div>
      </div>
      {/* {tabs.map(tab => renderContent(tab))} */}
    </div>
  );
};

export default ContestLayoutTabs;
