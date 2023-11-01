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
  const { minCostToPropose, networkNames } = useEntryChargeDetails(chain?.name ?? "");
  const chainUnitLabel = chains.find(c => c.name === chain?.name)?.nativeCurrency.symbol;
  const [entryChargeError, setEntryChargeError] = useState<string>("");
  const [submissionsPerUserError, setSubmissionsPerUserError] = useState<string>("");
  const [maxSubmissionsError, setMaxSubmissionsError] = useState<string>("");
  const disableDeploy =
    entryCharge.costToPropose < minCostToPropose || Boolean(submissionsPerUserError) || Boolean(maxSubmissionsError);

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
        if (disableDeploy) return;

        handleDeployContest();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [deployContest, isLoading]);

  useEffect(() => {
    if (maxSubmissions > DEFAULT_SUBMISSIONS && maxSubmissions <= MAX_SUBMISSIONS_LIMIT) {
      setAlertOnRewards(true);
    } else {
      setAlertOnRewards(false);
    }

    validateMaxSubmissions(maxSubmissions);
  }, [maxSubmissions]);

  useEffect(() => {
    validateSubmissionsPerUser(allowedSubmissionsPerUser);
  }, [allowedSubmissionsPerUser]);

  const handleDownvoteChange = async (value: boolean) => {
    setIsEnabled(value);
    setDownvote(value);
  };

  const onSubmissionsPerUserChange = (value: number | null) => {
    validateSubmissionsPerUser(value);
    if (value) setAllowedSubmissionsPerUser(value);
  };

  const onMaxSubmissionsChange = (value: number | null) => {
    validateMaxSubmissions(value);
    if (value) setMaxSubmissions(value);
  };

  const onEntryChargeValueChange = (value: number | null) => {
    if (value === null || value < minCostToPropose) {
      setEntryChargeError(`must be at least ${minCostToPropose}`);
    } else {
      setEntryChargeError("");
    }

    if (value) {
      setEntryCharge({
        ...entryCharge,
        costToPropose: value,
      });
    }
  };

  const onEntryChargePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = event.target.checked ? 0 : 50;
    setEntryCharge({
      ...entryCharge,
      percentageToCreator: newPercentage,
    });
  };

  const validateSubmissionsPerUser = (value: number | null) => {
    if (value === null || value < 1) {
      setSubmissionsPerUserError("must be at least 1");
    } else if (value > MAX_SUBMISSIONS_LIMIT) {
      setSubmissionsPerUserError(`must be less than ${MAX_SUBMISSIONS_LIMIT}`);
    } else {
      setSubmissionsPerUserError("");
    }
  };

  const validateMaxSubmissions = (value: number | null) => {
    if (value === null || value < 1) {
      setMaxSubmissionsError("must be at least 1");
    } else if (value > MAX_SUBMISSIONS_LIMIT) {
      setMaxSubmissionsError(`must be less than ${MAX_SUBMISSIONS_LIMIT}`);
    } else {
      setMaxSubmissionsError("");
    }
  };

  const entryChargeInfoMessage = useMemo(() => {
    if (!isConnected) {
      return "you must have a wallet connected to set an entry charge";
    }

    if (minCostToPropose <= 0) {
      const networksList = networkNames.join(", ");
      const isSingleNetwork = networkNames.length === 1;
      const singleNetworkMessage = `currently — ${networkNames[0]} is the only chain that entry charges are enabled on.`;
      const multipleNetworksMessage = `currently — ${networksList} are the chains that entry charges are enabled on`;

      return (
        <>
          {`we do not currently support entry charges on ${chain?.name} chain!`}
          <br />
          {isSingleNetwork ? singleNetworkMessage : multipleNetworksMessage}
        </>
      );
    }

    return "this can help keep out bots, and we’ll split it with you 50/50";
  }, [isConnected, minCostToPropose, networkNames, chain]);

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
              errorMessage={submissionsPerUserError}
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
              errorMessage={
                alertOnRewards
                  ? `please note you won't be able to add a rewards pool if you enable over ${DEFAULT_SUBMISSIONS} submissions`
                  : maxSubmissionsError
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
                onClick={() => handleDownvoteChange(true)}
              >
                {isMobile ? "yes" : "enable downvoting"}
              </div>
              <div
                className={`w-full px-4 py-1 cursor-pointer ${
                  !isEnabled ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
                }`}
                onClick={() => handleDownvoteChange(false)}
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
              className={`text-[16px] md:text-[24px] ${
                entryCharge.percentageToCreator === 0 ? "text-neutral-11" : "text-neutral-9"
              } md:-mt-1`}
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
          <CreateContestButton step={step} onClick={handleDeployContest} isDisabled={disableDeploy} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestParams;
