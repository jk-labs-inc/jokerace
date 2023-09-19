/* eslint-disable react-hooks/exhaustive-deps */
import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useEffect, useState } from "react";
import CSVEditorVoting, { VotingFieldObject } from "./components/CSVEditor";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateVotingAllowlist = () => {
  const { step, setVotingMerkle, votingMerkle, setError, setVotingAllowlist, votingAllowlist } = useDeployContestStore(
    state => state,
  );
  const votingValidation = validationFunctions.get(step);

  const onNextStep = useNextStep([() => votingValidation?.[0].validation(votingAllowlist)]);

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

    setVotingAllowlist(errorExists ? {} : newAllowList);
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setVotingMerkle({ merkleRoot, voters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlist processed successfully.");

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
    if (Object.keys(votingAllowlist).length === 0 || votingMerkle) {
      onNextStep();
      return;
    }

    toastLoading("processing your allowlist...", false);
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: votingAllowlist,
    });
  };

  return (
    <div className="mt-5 lg:ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can vote?</p>
        <p className="text-[16px] text-neutral-11">
          upload a csv below (up to 100k entries) <i>or</i> copy-paste an allowlist (up to 100 entries)
        </p>
        <p className="text-[16px] text-neutral-11">
          allowlists are necessary to avoid luck-based voting—and cannot be edited afterwards.
        </p>
      </div>
      <CSVEditorVoting onChange={handleAllowListChange} />
      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </div>
  );
};

export default CreateVotingAllowlist;
