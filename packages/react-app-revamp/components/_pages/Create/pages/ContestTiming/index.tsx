import { useDeployContestStore } from "@hooks/useDeployContest/store";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import CreateEndContestDate from "./components/EndDate";
import CreateSubmissionsOpenDate from "./components/SubmissionDate";
import CreateVotesOpenDate from "./components/VotesDate";

const CreateContestTiming = () => {
  const { errors, setStep, step } = useDeployContestStore(state => state);

  const onNextStep = () => {
    if (errors.length) return;
    setStep(step + 1);
  };

  return (
    <>
      <Description step={step + 1} title="" />
      <div className="flex flex-col ml-[70px] -mt-[45px] gap-10">
        <CreateSubmissionsOpenDate />
        <CreateVotesOpenDate />
        <CreateEndContestDate />
        <div className="mt-3">
          <CreateNextButton step={step} onClick={onNextStep} />
        </div>
      </div>
    </>
  );
};

export default CreateContestTiming;
