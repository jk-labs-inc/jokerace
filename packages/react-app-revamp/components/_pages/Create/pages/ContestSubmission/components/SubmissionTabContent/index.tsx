import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { useEffect, useRef, useState } from "react";
import CreateSubmissionAllowlist from "../SubmissionAllowlist";
import CreateSubmissionRequirements from "../SubmissionRequirements";
import CreateSubmissionCSVUploader from "../SubmissionUploadCsv";
import { useMediaQuery } from "react-responsive";

const tabOptions = [
  { label: "use presets", mobileLabel: "use presets", content: <CreateSubmissionRequirements /> },
  { label: "upload csv", mobileLabel: "use csv", content: <CreateSubmissionCSVUploader /> },
  { label: "set manually", mobileLabel: "set manually", content: <CreateSubmissionAllowlist /> },
];

const CreateSubmissionTabContent = () => {
  const { setSubmissionTab, submissionTab, setSubmissionMerkle } = useDeployContestStore(state => state);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const onSubmissionTabChange = (tabIndex: number) => {
    setSubmissionTab(tabIndex);
    setAllSubmissionMerkles(null);
  };

  const setAllSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled", "manual"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  useEffect(() => {
    if (tabRefs.current[submissionTab]) {
      const currentTab = tabRefs.current[submissionTab];
      setIndicatorStyle({
        left: `${currentTab?.offsetLeft}px`,
        width: `${currentTab?.offsetWidth}px`,
      });
    }
  }, [submissionTab]);

  return (
    <>
      <div className="relative flex-col mt-16">
        <div className="flex justify-between gap-2 lg:justify-start mb-4 sm:gap-8 sm:px-0">
          {tabOptions.map((link, index) => (
            <div
              key={index}
              ref={el => (tabRefs.current[index] = el)}
              className={`text-[20px] sm:text-[24px] font-bold cursor-pointer text-center transition-colors duration-200
                  ${index === tabOptions.length - 1 ? "w-[120px] md:w-[240px]" : "w-[120px] md:w-[224px]"}
                  ${submissionTab === index ? "text-primary-10" : "text-neutral-10"}`}
              onClick={() => onSubmissionTabChange(index)}
            >
              {isMobile ? link.mobileLabel : link.label}
            </div>
          ))}
          <div className="absolute left-0 w-full md:w-[750px] h-1 bottom-0 bg-neutral-0"></div>
          <div style={indicatorStyle} className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"></div>
        </div>
      </div>
      <div className="mt-8">{tabOptions[submissionTab].content}</div>
    </>
  );
};

export default CreateSubmissionTabContent;
