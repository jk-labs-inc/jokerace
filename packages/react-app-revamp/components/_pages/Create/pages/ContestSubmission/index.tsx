import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateTab from "../../components/Tab";
import CreateSubmissionAllowlist from "./components/SubmissionAllowlist";
import CreateSubmissionRequirements from "./components/SubmissionRequirements";
import { useEffect, useRef, useState } from "react";

const tabOptions = [
  { label: "use presets", content: <CreateSubmissionRequirements /> },
  { label: "upload csv", content: <CreateSubmissionAllowlist /> },
  { label: "write manually", content: <CreateSubmissionAllowlist /> },
];

const CreateContestSubmissions = () => {
  const { step, setSubmissionTab, submissionTab } = useDeployContestStore(state => state);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onSubmissionTabChange = (tabIndex: number) => {
    setSubmissionTab(tabIndex);
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
    <div className="mt-12 lg:mt-[78px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row items-start gap-10 text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <p className="text-[24px] text-primary-10 font-bold">Who can submit?</p>
            <p className="text-[20px] text-neutral-11">
              presets can save you time determining who can submit entries to your <br /> contest, but remember: you can
              always upload a csv to allowlist to any <br />
              addresses you like.
            </p>
          </div>

          <div className="relative flex-col mt-16">
            <div className="flex justify-between gap-2 lg:justify-start mb-4 sm:gap-8 sm:px-0">
              {tabOptions.map((link, index) => (
                <div
                  key={index}
                  ref={el => (tabRefs.current[index] = el)}
                  className={`text-[16px] sm:text-[24px] font-bold cursor-pointer text-center transition-colors duration-200
                  ${index === tabOptions.length - 1 ? "md:w-[240px]" : "md:w-[224px]"}
                  ${submissionTab === index ? "text-primary-10" : "text-neutral-10"}`}
                  onClick={() => onSubmissionTabChange(index)}
                >
                  {link.label}
                </div>
              ))}
              <div className="absolute left-0 w-full md:w-[750px] h-1 bottom-0 bg-neutral-0"></div>
              <div
                style={indicatorStyle}
                className="absolute bottom-0 h-1 bg-primary-10 transition-all duration-200"
              ></div>
            </div>
          </div>

          <div className="mt-12">{tabOptions[submissionTab].content}</div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestSubmissions;
