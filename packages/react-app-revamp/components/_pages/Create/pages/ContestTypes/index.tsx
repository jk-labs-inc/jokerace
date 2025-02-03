import CreateNextButton from "../../components/Buttons/Next";
import { useMediaQuery } from "react-responsive";
import CreateContestTypesAnyoneCanPlay from "./components/Types/AnyoneCanPlay";
import CreateContestTypesEntryBased from "./components/Types/EntryBased";
import CreateContestTypesVotingBased from "./components/Types/VotingBased";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { steps } from "../..";
import { useNextStep } from "../../hooks/useNextStep";
import { ContestType } from "../../types";

const CreateContestTypes = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { step, setContestType, contestType } = useDeployContestStore(state => state);
  const typeTitle = isMobile ? "what type of contest?" : "what kind of contest do you want to create?";
  const onNextStep = useNextStep();

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-neutral-11 font-bold">{typeTitle}</p>
        </div>

        <div className="grid gap-6 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-6">
          <CreateContestTypesAnyoneCanPlay
            isSelected={contestType === ContestType.AnyoneCanPlay}
            onClick={type => setContestType(type)}
          />
          <CreateContestTypesEntryBased
            isSelected={contestType === ContestType.EntryContest}
            onClick={type => setContestType(type)}
          />
          <CreateContestTypesVotingBased
            isSelected={contestType === ContestType.VotingContest}
            onClick={type => setContestType(type)}
          />
          <div className="mt-4">
            <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTypes;
