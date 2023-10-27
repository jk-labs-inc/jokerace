/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { chains } from "@config/wagmi";
import { DEFAULT_SUBMISSIONS, MAX_SUBMISSIONS_LIMIT, useDeployContest } from "@hooks/useDeployContest";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import useEntryChargeDetails from "@hooks/useEntryChargeDetails";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useMemo, useState } from "react";
import { useMedia } from "react-use";
import { useAccount, useNetwork } from "wagmi";
import CreateContestButton from "../../components/Buttons/Submit";
import CreateNumberInput from "../../components/NumberInput";
import StepCircle from "../../components/StepCircle";

const CreateContestParams = () => {
  const { deployContest } = useDeployContest();
  const { isLoading } = useDeployContestStore(state => state);
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const isMobile = useMedia("(max-width: 768px)");
  const {
    setMaxSubmissions,
    setAllowedSubmissionsPerUser,
    allowedSubmissionsPerUser,
    maxSubmissions,
    setDownvote,
    downvote,
    step,
    entryCharge,
    setEntryCharge,
  } = useDeployContestStore(state => state);
  const [isEnabled, setIsEnabled] = useState(downvote);
  const [alertOnRewards, setAlertOnRewards] = useState<boolean>(false);
  const minCostToPropose = useEntryChargeDetails(chain?.name ?? "");
  const chainUnitLabel = chains.find(c => c.name === chain?.name)?.nativeCurrency.symbol;
  const [entryChargeError, setEntryChargeError] = useState<string>("");

  useEffect(() => {
    setEntryCharge({
      ...entryCharge,
      costToPropose: minCostToPropose,
      percentageToCreator: 50,
    });
  }, [minCostToPropose, setEntryCharge]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (isLoading) return;

      if (event.key === "Enter") {
        if (!isConnected) {
          try {
            openConnectModal?.();
            return;
          } catch (err) {
            console.error("Failed to connect wallet", err);
            return; // If connection fails, don't proceed with deploying contest
          }
        }
        handleDeployContest();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [deployContest, isLoading]);

  useEffect(() => {
    if (maxSubmissions > DEFAULT_SUBMISSIONS) {
      setAlertOnRewards(true);
    } else {
      setAlertOnRewards(false);
    }
  }, [maxSubmissions]);

  const handleClick = async (value: boolean) => {
    setIsEnabled(value);
    setDownvote(value);
  };

  const onSubmissionsPerUserChange = (value: number) => {
    setAllowedSubmissionsPerUser(value);
  };

  const onMaxSubmissionsChange = (value: number) => {
    setMaxSubmissions(value);
  };

  const onEntryChargeValueChange = (value: number) => {
    if (value < minCostToPropose) {
      setEntryChargeError(`must be at least ${minCostToPropose}`);
    } else {
      setEntryChargeError("");
    }
    setEntryCharge({
      ...entryCharge,
      costToPropose: value,
    });
  };

  const onEntryChargePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = event.target.checked ? 0 : 50;
    setEntryCharge({
      ...entryCharge,
      percentageToCreator: newPercentage,
    });
  };

  const entryChargeInfoMessage = useMemo(() => {
    if (!isConnected) {
      return "you must have a wallet connected to set an entry charge";
    }
    if (minCostToPropose <= 0) {
      return (
        <>
          {"we do not currently support entry charges on the chain you're connected to!"}
          <br />
          {
            "currently — ethereum, polygon, arbitrum, base and optimism are the chains that entry charges are enabled on"
          }
        </>
      );
    }
    return "we’ll split this with you 50/50—we recommend a number that will help keep out bots";
  }, [isConnected, minCostToPropose]);

  const handleDeployContest = async () => {
    deployContest();
  };

  return (
    <div className="flex flex-col gap-12 mt-12 lg:mt-[50px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row gap-5">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-6 mt-2">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            how many submissions can each player enter?
          </p>
          <div className="flex flex-col gap-2">
            <CreateNumberInput
              value={allowedSubmissionsPerUser}
              onChange={onSubmissionsPerUserChange}
              max={MAX_SUBMISSIONS_LIMIT}
              defaultValue={1}
            />
          </div>
        </div>
      </div>
      <div className="md:ml-[70px] flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            how many total submissions does your contest accept?
          </p>
          <div className="flex flex-col gap-2">
            <CreateNumberInput
              value={maxSubmissions}
              onChange={onMaxSubmissionsChange}
              max={MAX_SUBMISSIONS_LIMIT}
              defaultValue={100}
              errorMessage={
                alertOnRewards
                  ? ` please note you won't be able to add a rewards pool if you enable over ${DEFAULT_SUBMISSIONS} submissions`
                  : ""
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            can players downvote—that is, vote <span className="italic">against</span> a submission?
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex w-full md:w-[380px]  border border-neutral-10 rounded-[25px] overflow-hidden text-[20px] md:text-[18px]">
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  isEnabled ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
                }`}
                onClick={() => handleClick(true)}
              >
                {isMobile ? "yes" : "enable downvoting"}
              </div>
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  !isEnabled ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
                }`}
                onClick={() => handleClick(false)}
              >
                {isMobile ? "no" : "disable downvoting"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
            what is the entry charge for players to submit to the contest?
          </p>
          <div className="flex flex-col gap-2">
            <CreateNumberInput
              value={entryCharge.costToPropose}
              defaultValue={minCostToPropose}
              onChange={onEntryChargeValueChange}
              readOnly={minCostToPropose <= 0}
              unitLabel={minCostToPropose > 0 ? chainUnitLabel : ""}
              errorMessage={entryChargeError}
            />
            {!entryChargeError && <p className="text-[16px] font-bold text-neutral-14">{entryChargeInfoMessage}</p>}
          </div>
          <div className="flex gap-4">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={entryCharge.percentageToCreator === 0}
                onChange={onEntryChargePercentageChange}
                disabled={minCostToPropose <= 0}
              />
              <span className="checkmark"></span>
            </label>
            <p
              className={`text-[24px] ${
                entryCharge.percentageToCreator === 0 ? "text-neutral-11" : "text-neutral-9"
              } -mt-1`}
            >
              give my 50% to support <span className="normal-case">JokeRace</span> instead
            </p>
          </div>
        </div>
        <div>
          <p className="text-[24px] text-neutral-11">
            that’s it! now let’s create this contest—and then you can add rewards
          </p>
        </div>
        <div>
          <CreateContestButton step={step} onClick={handleDeployContest} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestParams;
