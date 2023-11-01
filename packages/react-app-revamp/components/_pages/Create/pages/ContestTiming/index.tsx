/* eslint-disable react-hooks/exhaustive-deps */
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";
import CreateEndContestDate from "./components/EndDate";
import CreateSubmissionsOpenDate from "./components/SubmissionDate";
import CreateVotesOpenDate from "./components/VotesDate";

const CreateContestTiming = () => {
  const { step, votingOpen, votingClose, submissionOpen, setSubmissionOpen, setVotingOpen, setVotingClose } =
    useDeployContestStore(state => state);
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

      const votingOpenDate = new Date(now);
      votingOpenDate.setDate(now.getDate() + 7);
      setVotingOpen(votingOpenDate);

      const votingCloseDate = new Date(now);
      votingCloseDate.setDate(now.getDate() + 14);
      setVotingClose(votingCloseDate);
    }
  }, []);

  return (
    <div className="mt-12 lg:mt-[50px] flex flex-col lg:flex-row gap-5 animate-swingInLeft opacity-5">
      <StepCircle step={step + 1} />
      <div className="flex flex-col gap-10">
        <CreateSubmissionsOpenDate />
        <CreateVotesOpenDate />
        <CreateEndContestDate />
        <div className="mt-10 md:mt-3">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
