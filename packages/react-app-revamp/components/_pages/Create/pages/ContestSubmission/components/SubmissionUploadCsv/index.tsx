import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import { SubmissionFieldObject } from "../SubmissionAllowlist/components/CSVEditor";
import SubmissionCSVFileUploader from "./components/CSVUploadSubmission";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionCSVUploader = () => {
  const {
    submissionAllowlistFields: fields,
    submissionAllowlist,
    setSubmissionMerkle,
    setSubmissionAllowlist,
    setError,
    step,
  } = useDeployContestStore(state => state);
  const submissionValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => submissionValidation?.[0].validation(submissionAllowlist.manual)]);

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

    setSubmissionAllowlist("manual", hasError ? {} : newAllowList);
  };

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));

    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;

    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("manual", { merkleRoot, submitters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
    toastSuccess("allowlist processed successfully.");
    setSubmissionMerkle("prefilled", null);
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
    if (Object.keys(submissionAllowlist.manual).length === 0) return;

    toastLoading("processing your allowlist...", false);
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: submissionAllowlist.manual,
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
      <SubmissionCSVFileUploader onChange={onAllowListChange} />
      <CreateNextButton step={step + 1} onClick={handleNextStep} />
    </div>
  );
};

export default CreateSubmissionCSVUploader;
