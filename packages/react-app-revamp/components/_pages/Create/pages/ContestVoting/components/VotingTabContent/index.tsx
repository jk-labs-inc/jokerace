import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect, useRef, useState } from "react";
import CreateVotingRequirements from "../VotingRequirements";
import CreateVotingAllowlist from "../VotingAllowlist";
import CreateVotingCSVUploader from "../VotingUploadCsv";

const tabOptions = [
  { label: "use presets", content: <CreateVotingRequirements /> },
  { label: "upload csv", content: <CreateVotingCSVUploader /> },
  { label: "write manually", content: <CreateVotingAllowlist /> },
];

const CreateVotingTabContent = () => {
  const { setVotingTab, votingTab } = useDeployContestStore(state => state);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onVotingTabChange = (tabIndex: number) => {
    setVotingTab(tabIndex);
  };

  useEffect(() => {
    if (tabRefs.current[votingTab]) {
      const currentTab = tabRefs.current[votingTab];
      setIndicatorStyle({
        left: `${currentTab?.offsetLeft}px`,
        width: `${currentTab?.offsetWidth}px`,
      });
    }
  }, [votingTab]);

  return (
    <>
      <div className="relative flex-col mt-16">
        <div className="flex justify-between gap-2 lg:justify-start mb-4 sm:gap-8 sm:px-0">
          {tabOptions.map((link, index) => (
            <div
              key={index}
              ref={el => (tabRefs.current[index] = el)}
              className={`text-[16px] sm:text-[24px] font-bold cursor-pointer text-center transition-colors duration-200
                  ${index === tabOptions.length - 1 ? "md:w-[240px]" : "md:w-[224px]"}
                  ${votingTab === index ? "text-primary-10" : "text-neutral-10"}`}
              onClick={() => onVotingTabChange(index)}
            >
              {link.label}
            </div>
          ))}
          <div className="absolute left-0 w-full md:w-[750px] h-1 bottom-0 bg-neutral-0"></div>
          <div style={indicatorStyle} className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"></div>
        </div>
      </div>
      <div className="mt-8">{tabOptions[votingTab].content}</div>
    </>
  );
};

export default CreateVotingTabContent;
