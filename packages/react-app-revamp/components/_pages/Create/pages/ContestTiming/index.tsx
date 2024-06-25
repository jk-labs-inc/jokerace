/* eslint-disable react-hooks/exhaustive-deps */
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import CreateSubmissionPeriod from "./components/SubmissionPeriod";
import CreateVotingPeriod from "./components/VotingPeriod";

const CreateContestTiming = () => {
  const { step, submissionOpen, setSubmissionOpen } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const contestTitle = isMobile ? "timing" : "how long will the contest run?";

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
      <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10">
          <p className="text-[24px] font-bold text-primary-10">{contestTitle}</p>
        </div>
        <div className="grid col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-6">
          <div className="flex flex-col gap-8">
            <CreateSubmissionPeriod />
            <CreateVotingPeriod />
            <div className="mt-12">
              <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
