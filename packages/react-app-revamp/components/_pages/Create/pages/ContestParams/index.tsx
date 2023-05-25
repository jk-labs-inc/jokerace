import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState } from "react";
import CreateContestButton from "../../components/Buttons/Submit";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";

const CreateContestParams = () => {
  const {
    setMaxSubmissions,
    setAllowedSubmissionsPerUser,
    votingMerkle,
    maxSubmissions,
    setDownvote,
    downvote,
    step,
    errors,
  } = useDeployContestStore(state => state);
  const [isEnabled, setIsEnabled] = useState(downvote);

  const handleClick = (value: boolean) => {
    setIsEnabled(value);
    setDownvote(value);
  };

  const onSubmissionsPerUserChange = (value: string) => {
    setAllowedSubmissionsPerUser(parseInt(value));
  };

  const onMaxSubmissionsChange = (value: string) => {
    setMaxSubmissions(parseInt(value));
  };

  const onCreateContest = () => {};

  return (
    <div className="flex flex-col gap-8 mt-[50px] animate-swingInLeft">
      <div className="flex gap-5">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-5 mt-2">
          <p className="text-[24px] text-primary-10 font-bold">how many submissions can each player enter?</p>
          <div className="flex flex-col gap-2">
            <CreateTextInput placeholder="20" width={280} onChange={onSubmissionsPerUserChange} type="number" />
            <p className="text-neutral-11 text-[16px]">leave blank to enable infinite submissions</p>
          </div>
        </div>
      </div>
      <div className="ml-[70px] flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <p className="text-[24px] text-primary-10 font-bold">how many total submissions does your contest accept?</p>
          <div className="flex flex-col gap-2">
            <CreateTextInput
              value={maxSubmissions}
              placeholder="20"
              width={280}
              type="number"
              onChange={onMaxSubmissionsChange}
            />
            <p className="text-neutral-11 text-[16px]">leave blank to enable infinite submissions</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-[24px] text-primary-10 font-bold">
            can players downvote—that is, vote <span className="italic">against</span> a submission?
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex w-[490px]  border border-primary-10 rounded-[25px] overflow-hidden text-[24px]">
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  isEnabled ? "bg-primary-10 text-true-black font-bold" : "bg-true-black text-primary-10"
                }`}
                onClick={() => handleClick(true)}
              >
                Enable Downvoting
              </div>
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  !isEnabled ? "bg-primary-10 text-true-black font-bold" : "bg-true-black text-primary-10"
                }`}
                onClick={() => handleClick(false)}
              >
                Disable Downvoting
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreateContestButton step={step} onClick={onCreateContest} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestParams;
