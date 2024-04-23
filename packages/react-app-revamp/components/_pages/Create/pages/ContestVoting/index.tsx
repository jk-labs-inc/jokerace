import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateVotingTabContent from "./components/VotingTabContent";
import CreateVotingTabMessage from "./components/VotingTabMessage";

const CreateContestVoting = () => {
  const { step } = useDeployContestStore(state => state);

  return (
    <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="col-span-1">
        <StepCircle step={step + 1} />
      </div>
      <div className="col-span-2 ml-10">
        <p className="text-[24px] text-primary-10 font-bold">Who can vote?</p>
      </div>
      <div className="grid col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
        <CreateVotingTabMessage />
        <CreateVotingTabContent />
      </div>
    </div>
  );
};

export default CreateContestVoting;
