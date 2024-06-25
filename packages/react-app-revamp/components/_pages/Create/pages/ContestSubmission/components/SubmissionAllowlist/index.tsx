import { toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { MerkleKey, useDeployContestStore } from "@hooks/useDeployContest/store";
import { SubmissionMerkle } from "@hooks/useDeployContest/types";
import { Recipient } from "lib/merkletree/generateMerkleTree";
import CSVEditorSubmission, { SubmissionFieldObject } from "./components/CSVEditor";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

const CreateSubmissionAllowlist = () => {
  const { step, setSubmissionMerkle, setError, submissionAllowlist, setSubmissionAllowlist, submissionTab } =
    useDeployContestStore(state => state);
  const onNextStep = useNextStep();

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

  const setBothSubmissionMerkles = (value: SubmissionMerkle | null) => {
    const keys: MerkleKey[] = ["csv", "prefilled"];
    keys.forEach(key => setSubmissionMerkle(key, value));
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>): void => {
    const { merkleRoot, recipients } = event.data;

    setSubmissionMerkle("manual", { merkleRoot, submitters: recipients });
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
        <p className="text-[20px] text-neutral-11 font-bold">to set allowlist manually:</p>
        <ul className="flex flex-col  pl-8">
          <li className="text-[20px] text-neutral-11 list-disc">
            write or copy up to 100 addresses in the left column
          </li>
        </ul>
        <CSVEditorSubmission onChange={onAllowListChange} />
      </div>

      <CreateNextButton
        step={step + 1}
        onClick={handleNextStep}
        isDisabled={Object.keys(submissionAllowlist.manual).length === 0}
      />
    </div>
  );
};

export default CreateSubmissionAllowlist;
