/* eslint-disable react-hooks/exhaustive-deps */
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import CreateContestTimingDropdown from "./components/Dropdown";

const CreateContestTiming = () => {
  const { steps } = useContestSteps();
  const { step, submissionOpen, setSubmissionOpen } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const contestTitle = isMobile ? "how long is voting?" : "how long does voting run?";

  useEffect(() => {
    const now = new Date();
    const submissionOpenLessThanNow = submissionOpen.getTime() < now.getTime();
    if (submissionOpenLessThanNow) {
      setSubmissionOpen(now);
    }
  }, []);

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="grid grid-cols-(--grid-full-width-create-flow) mt-12 lg:mt-[70px] animate-swing-in-left">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] font-bold text-neutral-11">{contestTitle}</p>
        </div>
        <div className="grid col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-6">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 w-[448px] rounded-4xl p-6 bg-primary-1 text-[16px] text-neutral-11">
              <p>entries can be submitted anytime before voting opens.</p>
              <p>
                <b>we recommend two hours to vote</b> so anyone can
                <br />
                participate actively, as in a sports game.
              </p>
            </div>
            <CreateContestTimingDropdown
              label="september"
              options={[
                { label: "september", value: "september" },
                { label: "october", value: "october" },
                { label: "november", value: "november" },
                { label: "december", value: "december" },
              ]}
              width="w-[168px]"
            />
            <div className="mt-4">
              <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
