import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import { useContestSteps } from "../../hooks/useContestSteps";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import CreateVotingRadioGroup from "./components/VotingRadioGroup";

const CreateContestVoting = () => {
  const { step } = useDeployContestStore(state => state);
  const { steps } = useContestSteps();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="grid grid-cols-(--grid-full-width-create-flow) mt-12 lg:mt-[70px] animate-swing-in-left">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-neutral-11 font-bold">Who can vote?</p>
        </div>
        <div className="grid col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
          <CreateVotingRadioGroup />
        </div>
      </div>
    </div>
  );
};

export default CreateContestVoting;
