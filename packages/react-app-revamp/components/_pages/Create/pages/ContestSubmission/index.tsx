import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Description from "../../components/Description";
import CreateTab from "../../components/Tab";
import CreateSubmissionAllowlist from "./components/SubmissionAllowlist";

const tabOptions = [
  { label: "set submission requirements", content: <div className="mt-7 ml-[20px]">voting req tab</div> },
  { label: "set allowlist manually", content: <CreateSubmissionAllowlist /> },
];

const CreateContestSubmissions = () => {
  const { errors, setStep, step } = useDeployContestStore(state => state);

  return (
    <div className="mt-[50px]">
      <Description step={step + 1} additionalContent={<CreateTab options={tabOptions} />} title="" />
    </div>
  );
};

export default CreateContestSubmissions;
