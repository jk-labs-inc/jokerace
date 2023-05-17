import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Description from "../../components/Description";
import CreateTab from "../../components/Tab";
import CreateVotingAllowlist from "./components/VotingAllowlist";

const tabOptions = [
  { label: "set allowlist manually", content: <CreateVotingAllowlist /> },
  { label: "set voting requirements", content: <div className="mt-7 ml-[20px]">Content for Tab 2</div> },
];

const CreateContestVoting = () => {
  const { errors, setStep, step } = useDeployContestStore(state => state);

  return (
    <div className="mt-[50px]">
      <Description step={step + 1} additionalContent={<CreateTab options={tabOptions} />} title="" />
    </div>
  );
};

export default CreateContestVoting;
