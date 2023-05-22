import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import { useNextStep } from "../../hooks/useNextStep";
import CreateEndContestDate from "./components/EndDate";
import CreateSubmissionsOpenDate from "./components/SubmissionDate";
import CreateVotesOpenDate from "./components/VotesDate";

const CreateContestTiming = () => {
  const { setStep, step } = useDeployContestStore(state => state);
  const onNextStep = useNextStep(() => "");

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

  return (
    <div className="mt-[50px]">
      <Description step={step + 1} title="" />
      <div className="flex flex-col ml-[70px] -mt-[45px] gap-10">
        <CreateSubmissionsOpenDate />
        <CreateVotesOpenDate />
        <CreateEndContestDate />
        <div className="mt-3">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
