import { useDeployContest } from "@hooks/useDeployContest";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import { useAccount } from "wagmi";
import CreateContestButton from "../../components/Buttons/Submit";
import StepCircle from "../../components/StepCircle";
import CreateTextInput from "../../components/TextInput";

const CreateContestParams = () => {
  const { deployContest } = useDeployContest();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const isMobile = useMedia("(max-width: 768px)");

  const { setMaxSubmissions, setAllowedSubmissionsPerUser, maxSubmissions, setDownvote, downvote, step } =
    useDeployContestStore(state => state);
  const [isEnabled, setIsEnabled] = useState(downvote);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleDeployContest();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [deployContest]);

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

  const handleDeployContest = () => {
    if (!isConnected) {
      try {
        openConnectModal?.();
      } catch (err) {
        console.error("Failed to connect wallet", err);
        return; // If connection fails, don't proceed with deploying contest
      }
    }
    deployContest();
  };

  return (
    <div className="flex flex-col gap-8 mt-12 lg:mt-[50px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row gap-5">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-5 mt-2">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            how many submissions can each player enter?
          </p>
          <div className="flex flex-col gap-2">
            <CreateTextInput
              placeholder="20"
              className="w-full md:w-[280px]"
              onChange={onSubmissionsPerUserChange}
              type="number"
            />
            <p className="text-neutral-11 text-[16px]">leave blank to enable infinite submissions</p>
          </div>
        </div>
      </div>
      <div className="md:ml-[70px] flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            how many total submissions does your contest accept?
          </p>
          <div className="flex flex-col gap-2">
            <CreateTextInput
              value={maxSubmissions}
              placeholder="200"
              className="w-full md:w-[280px]"
              type="number"
              onChange={onMaxSubmissionsChange}
            />
            <p className="text-neutral-11 text-[16px]">leave blank to enable infinite submissions</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            can players downvote—that is, vote <span className="italic">against</span> a submission?
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex w-full md:w-[490px]  border border-primary-10 rounded-[25px] overflow-hidden text-[20px] md:text-[24px]">
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  isEnabled ? "bg-primary-10 text-true-black font-bold" : "bg-true-black text-primary-10"
                }`}
                onClick={() => handleClick(true)}
              >
                {isMobile ? "yes" : "enable downvoting"}
              </div>
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  !isEnabled ? "bg-primary-10 text-true-black font-bold" : "bg-true-black text-primary-10"
                }`}
                onClick={() => handleClick(false)}
              >
                {isMobile ? "no" : "disable downvoting"}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreateContestButton step={step} onClick={handleDeployContest} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestParams;
