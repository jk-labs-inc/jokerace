import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { steps } from "@components/_pages/Create";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { useCallback, useEffect } from "react";
import { SubmissionFieldObject } from "../SubmissionAllowlist/components/CSVEditor";
import SubmissionCSVFileUploader from "./components/CSVUploadSubmission";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionCSVUploader = () => {
  const {
    submissionAllowlist,
    setSubmissionMerkle,
    setSubmissionAllowlist,
    setError,
    step,
    mobileStepTitle,
    resetMobileStepTitle,
    submissionTab,
  } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();

  const handleNextStepMobile = useCallback(() => {
    if (!mobileStepTitle || submissionTab !== 1) return;

    if (mobileStepTitle === steps[step].title) {
      handleNextStep();
      resetMobileStepTitle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileStepTitle, onNextStep, resetMobileStepTitle, step]);

  // Mobile listeners
  useEffect(() => {
    handleNextStepMobile();
  }, [handleNextStepMobile]);

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

    setSubmissionAllowlist("csv", hasError ? {} : newAllowList);
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const setBothSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["manual", "prefilled"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("csv", { merkleRoot, submitters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlist processed successfully.");
    setBothSubmissionMerkles(null);
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
    if (Object.keys(submissionAllowlist.csv).length === 0) return;

    toastLoading("processing your allowlist...", false);
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: submissionAllowlist.csv,
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
          <li className="text-[20px] text-neutral-11 list-disc">
            make sure there are no additional headers or columns
          </li>
        </ul>
      </div>
      <SubmissionCSVFileUploader onChange={onAllowListChange} onNext={handleNextStep} />
      <CreateNextButton
        step={step + 1}
        onClick={handleNextStep}
        isDisabled={Object.keys(submissionAllowlist.csv).length === 0}
      />
    </div>
  );
};

export default CreateSubmissionCSVUploader;
