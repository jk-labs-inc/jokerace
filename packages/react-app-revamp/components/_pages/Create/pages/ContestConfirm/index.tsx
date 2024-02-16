import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateContestConfirmTitle from "./components/Title";

export enum Steps {
  ContestTitle = 0,
  ContestDescription = 1,
  ContestSummary = 2,
  ContestTag = 3,
  ContestTiming = 4,
  ContestSubmissions = 5,
  ContestVoting = 6,
  ContestMonetization = 7,
  ContestCustomization = 8,
}

const CreateContestConfirm = () => {
  const { ...state } = useDeployContestStore(state => state);

  const onNavigateToStep = (step: Steps) => {
    state.setStep(step);
  };

  return (
    <div className="mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10 text-[20px] md:text-[24px]">
        <StepCircle step={state.step + 1} />
        <div className="flex flex-col gap-4">
          <p className="text-[24px] text-primary-10 font-bold">finally, let’s confirm</p>
          <CreateContestConfirmTitle
            step={Steps.ContestTitle}
            title={state.title}
            onClick={step => onNavigateToStep(step)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateContestConfirm;
