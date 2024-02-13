/* eslint-disable react-hooks/exhaustive-deps */
import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { VotingMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useEffect } from "react";
import { VotingFieldObject } from "../VotingAllowlist/components/CSVEditor";
import VotingCSVFileUploader from "./components";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateVotingCSVUploader = () => {
  const {
    step,
    setVotingMerkle,
    votingMerkle,
    setError,
    setVotingAllowlist,
    votingAllowlist,
    submissionMerkle,
    votingRequirements,
    setVotingRequirements,
  } = useDeployContestStore(state => state);
  const votingValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => votingValidation?.[0].validation(votingAllowlist.csv)]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  const handleAllowListChange = (fields: VotingFieldObject[]) => {
    let newAllowList: Record<string, number> = {};
    let errorExists = false;

    for (const field of fields) {
      if (field.address || field.votes) {
        newAllowList[field.address] = Number(field.votes);
        if (field.error !== null) {
          errorExists = true;
          break;
        }
      }
    }

    setVotingAllowlist("csv", errorExists ? {} : newAllowList);
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setVotingMerkle("csv", { merkleRoot, voters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlist processed successfully.");
    resetPrefilledAllowlist();
    terminateWorker(event.target as Worker);
  };

  const handleWorkerError = (error: ErrorEvent): void => {
    console.error("Worker error:", error);
    toastError("something went wrong, please try again.");

    terminateWorker(error.target as Worker);
  };
  const terminateWorker = (worker: Worker): void => {
    if (worker && worker.terminate) {
      worker.terminate();
    }
  };

  const handleNextStep = () => {
    if (Object.keys(votingAllowlist.csv).length === 0 || votingMerkle.csv) {
      onNextStep();
      return;
    }

    toastLoading("processing your allowlist...", false);
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: votingAllowlist.csv,
    });
  };

  const setBothVotingMerkles = (value: VotingMerkle | null) => {
    const keys: MerkleKey[] = ["prefilled", "manual"];
    keys.forEach(key => setVotingMerkle(key, value));
  };

  const setBothAllowlists = (value: Record<string, number>) => {
    const keys: MerkleKey[] = ["prefilled", "manual"];
    keys.forEach(key => setVotingAllowlist(key, value));
  };

  const resetPrefilledAllowlist = () => {
    setBothVotingMerkles(null);
    setBothAllowlists({});
    setVotingRequirements({
      ...votingRequirements,
      chain: "mainnet",
      tokenAddress: "",
      powerValue: 100,
      powerType: "token",
    });
  };
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-[20px] text-neutral-11 font-bold">to format csv:</p>
        <ul className="flex flex-col  pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">
            put up to 100,000 addresses in the left column (each starting with “0x”)
          </li>
          <li className="text-[20px] text-neutral-11 list-disc">put number of votes in the right column</li>
          <li className="text-[20px] text-neutral-11 list-disc">
            make sure there are no additional headers or columns
          </li>
        </ul>
      </div>
      <VotingCSVFileUploader onChange={handleAllowListChange} />
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateVotingCSVUploader;
