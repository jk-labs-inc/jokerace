/* eslint-disable react-hooks/exhaustive-deps */
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";
import CreateSubmissionPeriod from "./components/SubmissionPeriod";
import CreateVotingPeriod from "./components/VotingPeriod";

const CreateContestTiming = () => {
  const { step, votingOpen, votingClose, submissionOpen, setSubmissionOpen } = useDeployContestStore(state => state);
  const datesValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([
    () => datesValidation?.[0].validation(votingOpen, submissionOpen),
    () => datesValidation?.[1].validation(votingClose, votingOpen, submissionOpen),
  ]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  useEffect(() => {
    const now = new Date();
    const submissionOpenLessThanNow = submissionOpen.getTime() < now.getTime();
    if (submissionOpenLessThanNow) {
      setSubmissionOpen(now);
    }
  }, []);

  return (
    <div className="mt-12 lg:mt-[78px] flex flex-col lg:flex-row gap-10 animate-swingInLeft opacity-5">
      <StepCircle step={step + 1} />
      <div className="flex flex-col gap-14">
        <p className="text-[24px] font-bold text-primary-10">how long will the contest run?</p>
        <CreateSubmissionPeriod />
        <CreateVotingPeriod />
        <div className="mt-10 md:mt-6">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
