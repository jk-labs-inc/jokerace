import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateTab from "../../components/Tab";
import CreateSubmissionAllowlist from "./components/SubmissionAllowlist";
import CreateSubmissionRequirements from "./components/SubmissionRequirements";

const tabOptions = [
  { label: "set submission requirements", content: <CreateSubmissionRequirements /> },
  { label: "set allowlist manually", content: <CreateSubmissionAllowlist /> },
];

const CreateContestSubmissions = () => {
  const { errors, setStep, step } = useDeployContestStore(state => state);

  return (
    <div className="mt-[50px] animate-swingInLeft">
      <div className="flex items-start gap-5 text-[24px]">
        <StepCircle step={step + 1} />
        <CreateTab width={650} options={tabOptions} />
      </div>
    </div>
  );
};

export default CreateContestSubmissions;
