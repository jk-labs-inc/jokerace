import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateVotingTabContent from "./components/VotingTabContent";
import CreateVotingTabMessage from "./components/VotingTabMessage";

const CreateContestVoting = () => {
  const { step } = useDeployContestStore(state => state);

  return (
    <div className="mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row items-start gap-10 text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <p className="text-[24px] text-primary-10 font-bold">Who can vote?</p>
            <CreateVotingTabMessage />
          </div>
          <CreateVotingTabContent />
        </div>
      </div>
    </div>
  );
};

export default CreateContestVoting;
