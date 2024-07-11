import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VotingMerkle } from "@hooks/useDeployContest/types";
import { useEffect, useRef, useState } from "react";
import CreateVotingAllowlist from "../VotingAllowlist";
import CreateVotingRequirements from "../VotingRequirements";
import CreateVotingCSVUploader from "../VotingUploadCsv";
import { useMediaQuery } from "react-responsive";

const tabOptions = [
  { label: "use presets", mobileLabel: "use presets", content: <CreateVotingRequirements /> },
  { label: "upload csv", mobileLabel: "use csv", content: <CreateVotingCSVUploader /> },
  { label: "set manually", mobileLabel: "set manually", content: <CreateVotingAllowlist /> },
];

const CreateVotingTabContent = () => {
  const { setVotingTab, votingTab, setVotingMerkle } = useDeployContestStore(state => state);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const onVotingTabChange = (tabIndex: number) => {
    setVotingTab(tabIndex);
    setAllVotingMerkles(null);
  };

  const setAllVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled", "manual"];
    keys.forEach(key => setVotingMerkle(key, value));
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
    <div className="flex flex-col gap-8 mt-8 md:mt-16">
      <div className="relative flex-col">
        <div className="flex justify-between gap-2 lg:justify-start mb-4 sm:gap-8 sm:px-0">
          {tabOptions.map((link, index) => (
            <div
              key={index}
              ref={(el: HTMLDivElement | null) => {
                tabRefs.current[index] = el;
                return;
              }}
              className={`text-[20px] sm:text-[24px] font-bold cursor-pointer text-center transition-colors duration-200
                  ${index === tabOptions.length - 1 ? "w-[116px] md:w-[240px]" : "w-[116px] md:w-[224px]"}
                  ${votingTab === index ? "text-primary-10" : "text-neutral-10"}`}
              onClick={() => onVotingTabChange(index)}
            >
              {isMobile ? link.mobileLabel : link.label}
            </div>
          ))}
          <div className="absolute left-0 w-full md:w-[750px] h-1 bottom-0 bg-neutral-0"></div>
          <div style={indicatorStyle} className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"></div>
        </div>
      </div>
      <div>{tabOptions[votingTab].content}</div>
    </div>
  );
};

export default CreateVotingTabContent;
