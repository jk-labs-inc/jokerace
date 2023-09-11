/* eslint-disable react-hooks/exhaustive-deps */
import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useEffect } from "react";
import CSVEditorSubmission, { SubmissionFieldObject } from "./components/CSVEditor";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionAllowlist = () => {
  const { step, setSubmissionMerkle, submissionMerkle, setError, submissionAllowList, setSubmissionAllowlist } =
    useDeployContestStore(state => state);
  const submissionValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => submissionValidation?.[0].validation(submissionAllowList)]);

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

  const onAllowListChange = (fields: Array<SubmissionFieldObject>) => {
    const newAllowList: Record<string, number> = {};

    let hasError = false;
    for (const field of fields) {
      if (field.address === "") continue;

      if (field.error === true) {
        hasError = true;
        break;
      }

      newAllowList[field.address] = 10; // numVotes is hardcoded to 10
    }

    setSubmissionAllowlist(hasError ? {} : newAllowList);
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle({ merkleRoot, submitters: recipients });
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
    if (Object.keys(submissionAllowList).length === 0) return;

    if (submissionMerkle) {
      onNextStep();
      return;
    }

    toastLoading("processing your allowlist...", false);
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: submissionAllowList,
    });
  };

  return (
    <div className="mt-5 md:ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can submit?</p>
        <p className="text-[16px] text-neutral-11">
          upload a csv below (up to 100k entries) <i>or</i> copy-paste an allowlist (up to 100 entries)
        </p>
      </div>
      <CSVEditorSubmission onChange={onAllowListChange} />

      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </div>
  );
};

export default CreateSubmissionAllowlist;
