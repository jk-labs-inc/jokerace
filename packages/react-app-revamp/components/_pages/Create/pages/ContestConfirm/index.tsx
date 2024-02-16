import { useDeployContestStore } from "@hooks/useDeployContest/store";
import StepCircle from "../../components/StepCircle";
import CreateContestConfirmAllowlists from "./components/Allowlists";
import CreateContestConfirmDescription from "./components/Description";
import CreateContestConfirmMonetization from "./components/Monetization";
import CreatContestConfirmSummary from "./components/Summary";
import CreateContestConfirmTag from "./components/Tag";
import CreateContestConfirmTiming from "./components/Timing";
import CreateContestConfirmTitle from "./components/Title";
import CreateContestConfirmCustomization from "./components/Customization";
import CreateContestButton from "../../components/Buttons/Submit";
import { useDeployContest } from "@hooks/useDeployContest";

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
  const { deployContest } = useDeployContest();

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
          <CreateContestConfirmTag step={Steps.ContestTag} tag={state.type} onClick={step => onNavigateToStep(step)} />
          <CreatContestConfirmSummary
            step={Steps.ContestSummary}
            summary={state.summary}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmDescription
            step={Steps.ContestDescription}
            prompt={state.prompt}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmTiming
            step={Steps.ContestTiming}
            onClick={step => onNavigateToStep(step)}
            timing={{
              submissionOpen: state.submissionOpen,
              votingOpen: state.votingOpen,
              votingClose: state.votingClose,
            }}
          />
          <CreateContestConfirmAllowlists
            step={Steps.ContestSubmissions}
            onClick={step => onNavigateToStep(step)}
            allowlists={{
              submissionMerkle: state.submissionMerkle,
              votingMerkle: state.votingMerkle,
              submissionRequirements: state.submissionRequirements,
              votingRequirements: state.votingRequirements,
              submissionTypeOption: state.submissionTypeOption,
            }}
          />
          <CreateContestConfirmMonetization
            step={Steps.ContestMonetization}
            charge={state.charge}
            onClick={step => onNavigateToStep(step)}
          />
          <CreateContestConfirmCustomization
            customization={{
              customization: state.customization,
              advancedOptions: state.advancedOptions,
            }}
            step={Steps.ContestCustomization}
            onClick={step => onNavigateToStep(step)}
          />
          <div className="mt-12">
            <CreateContestButton step={state.step} onClick={deployContest} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestConfirm;
