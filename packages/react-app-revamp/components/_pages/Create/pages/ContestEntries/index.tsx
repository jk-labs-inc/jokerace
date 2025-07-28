import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import ContestParamsMetadata from "../ContestParams/components/Metadata";
import ContestEntriesAdditionalDescription from "./components/AdditionalDescription";
import ContestEntriesPreview from "./components/Preview";

const CreateContestEntries = () => {
  const { steps } = useContestSteps();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { step, metadataToggle, setMetadataToggle } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const stepTitle = "format";

  const toggleMetadata = () => {
    setMetadataToggle(!metadataToggle);
  };

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="grid grid-cols-[var(--grid-full-width-create-flow)] mt-12 lg:mt-[70px] animate-swing-in-left">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] text-neutral-11 font-bold">{stepTitle}</p>
        </div>

        <div className="grid gap-12 col-start-1 md:col-start-2 col-span-3 md:col-span-2 md:ml-10 mt-8 md:mt-14">
          <ContestEntriesPreview />
          <ContestEntriesAdditionalDescription />

          <button className="flex gap-4 items-center" onClick={toggleMetadata}>
            <p className="text-[20px] text-positive-11">add additional fields</p>
            <ChevronUpIcon
              className={`w-6 h-6 text-positive-11 transition-transform duration-300 ${
                metadataToggle ? "rotate-180" : ""
              }`}
            />
          </button>
          {metadataToggle ? <ContestParamsMetadata /> : null}

          <div className="mt-4">
            <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestEntries;
