import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateTab from "../../components/Tab";
import CreateVotingAllowlist from "./components/VotingAllowlist";
import CreateVotingRequirements from "./components/VotingRequirements";

const tabOptions = [
  { label: "set allowlist manually", content: <CreateVotingAllowlist /> },
  { label: "use prefilled requirements", content: <CreateVotingRequirements />, isNew: true },
];

const CreateContestVoting = () => {
  const { step, setVotingTab, votingTab } = useDeployContestStore(state => state);

  const onVotingTabChange = (tabIndex: number) => {
    setVotingTab(tabIndex);
  };

  return (
    <div className="mt-12 lg:mt-[50px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-5 text-[24px]">
        <StepCircle step={step + 1} />
        <CreateTab
          options={tabOptions}
          className="w-full md:w-[650px]"
          onSelectTab={onVotingTabChange}
          defaultTab={votingTab}
        />
      </div>
    </div>
  );
};

export default CreateContestVoting;
