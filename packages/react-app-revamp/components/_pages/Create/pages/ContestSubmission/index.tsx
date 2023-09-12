import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateTab from "../../components/Tab";
import CreateSubmissionAllowlist from "./components/SubmissionAllowlist";
import CreateSubmissionRequirements from "./components/SubmissionRequirements";

const tabOptions = [
  { label: "use prefilled requirements", content: <CreateSubmissionRequirements /> },
  { label: "set allowlist manually", content: <CreateSubmissionAllowlist /> },
];

const CreateContestSubmissions = () => {
  const { step, setSubmissionTab, submissionTab } = useDeployContestStore(state => state);

  const onSubmissionTabChange = (tabIndex: number) => {
    setSubmissionTab(tabIndex);
  };

  return (
    <div className="mt-12 lg:mt-[50px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row items-start gap-5 text-[24px]">
        <StepCircle step={step + 1} />
        <CreateTab
          options={tabOptions}
          onSelectTab={onSubmissionTabChange}
          defaultTab={submissionTab}
          className="w-full md:w-[650px]"
        />
      </div>
    </div>
  );
};

export default CreateContestSubmissions;
