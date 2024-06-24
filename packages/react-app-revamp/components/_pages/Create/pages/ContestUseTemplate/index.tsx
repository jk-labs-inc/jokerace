import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import useSetContestTemplate from "@hooks/useSetContestTemplate";
import Image from "next/image";
import { useMemo, useState } from "react";
import { steps } from "../..";
import Stepper from "../../components/Stepper";
import CreateTemplateDropdown, { TemplateOption } from "../../components/TemplateDropdown";
import GeneralTemplate from "../../templates";
import { getTemplateConfigByType } from "../../templates/templates";
import { TemplateType } from "../../templates/types";
import { StepTitle } from "../../types";
import { useCreateContestStartStore } from "../ContestStart";

const templateOptions: TemplateOption[] = Object.values(TemplateType).map(value => ({
  value: value as TemplateType,
  label: value,
}));

const CreateContestTemplate = () => {
  const { setStartContestWithTemplate } = useCreateContestStartStore(state => state);
  const { step: currentStep, setStep } = useDeployContestStore(state => state);
  const setContestTemplateConfig = useSetContestTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | "">("");
  const [fadeBg, setFadeBg] = useState(false);
  const [showStepper, setShowStepper] = useState(false);
  const [isFullMode, setIsFullMode] = useState(false);

  const templateConfig = useMemo(
    () => (selectedTemplate ? getTemplateConfigByType(selectedTemplate) : null),
    [selectedTemplate],
  );

  const filteredSteps = useMemo(() => {
    if (!templateConfig) return steps;
    return steps.filter(step => templateConfig.stepsToFulfill.includes(step.title as StepTitle));
  }, [templateConfig]);

  const handleNextClick = () => {
    if (selectedTemplate && templateConfig) {
      setContestTemplateConfig(templateConfig);
      setShowStepper(true);
      setStep(0);
    }
  };

  const handleBackClick = () => {
    setStartContestWithTemplate(false);
    setShowStepper(false);
  };

  if (showStepper) {
    if (currentStep === filteredSteps.length - 1 && !isFullMode) {
      setIsFullMode(true);
      setStep(steps.length - 1);
    }

    const stepsToShow = isFullMode ? steps : filteredSteps;
    return <Stepper steps={stepsToShow} />;
  }

  return (
    <div className="flex flex-col gap-12 lg:ml-[300px] mt-6 md:mt-32 animate-reveal">
      <div className="flex flex-col gap-6">
        <p className="text-[24px] text-primary-10 font-bold">Pick a template</p>
        <p className="text-[20px] text-neutral-11">
          Pick one of the following templates to save time filling in fields.
        </p>
      </div>
      <CreateTemplateDropdown
        options={templateOptions}
        className="w-full md:w-[240px]"
        onChange={value => setSelectedTemplate(value)}
        onMenuStateChange={setFadeBg}
      />
      <div
        className={`flex flex-col gap-12 ${fadeBg ? "opacity-50" : "opacity-100"} mt-4 transition-opacity duration-300 ease-in-out `}
      >
        {selectedTemplate ? <GeneralTemplate templateType={selectedTemplate} /> : null}
        <div className="flex gap-4 items-start mt-14">
          <div className={`flex flex-col gap-4 items-center`}>
            <ButtonV3
              colorClass="text-[20px] bg-gradient-next rounded-[10px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
              size={ButtonSize.LARGE}
              onClick={handleNextClick}
              isDisabled={!selectedTemplate}
            >
              Next
            </ButtonV3>
            <div
              className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
              onClick={handleBackClick}
            >
              <div className="transition-transform duration-200 group-hover:-translate-x-1">
                <Image src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
              </div>
              <p className="text-[16px]">Back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTemplate;
