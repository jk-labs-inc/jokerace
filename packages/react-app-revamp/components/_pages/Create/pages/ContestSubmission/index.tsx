import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Description from "../../components/Description";
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
    <div className="mt-[50px]">
      <Description step={step + 1} additionalContent={<CreateTab width={700} options={tabOptions} />} title="" />
    </div>
  );
};

export default CreateContestSubmissions;
