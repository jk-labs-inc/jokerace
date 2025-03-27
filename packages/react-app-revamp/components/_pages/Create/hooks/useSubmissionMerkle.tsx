import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Recipient } from "lib/merkletree/generateMerkleTree";

type WorkerMessageData = {
  merkleRoot: string;
  recipients: Recipient[];
};

export const useSubmissionMerkle = () => {
  const { setSubmissionMerkle } = useDeployContestStore(state => state);

  const initializeWorker = () => {
    const worker = new Worker(new URL("/workers/generateRootAndRecipients", import.meta.url));
    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;
    return worker;
  };

  const handleWorkerMessage = (event: MessageEvent<WorkerMessageData>) => {
    const { merkleRoot, recipients } = event.data;
    setSubmissionMerkle({ merkleRoot, submitters: recipients });
    terminateWorker(event.target as Worker);
  };

  const terminateWorker = (worker: Worker): void => {
    if (worker && worker.terminate) {
      worker.terminate();
    }
  };

  const handleWorkerError = (error: ErrorEvent) => {
    console.error("Worker error:", error);
    if (error.target && (error.target as Worker).terminate) {
      (error.target as Worker).terminate();
    }
  };

  const processCreatorAllowlist = (address: string | undefined) => {
    if (!address) return;
    const worker = initializeWorker();
    worker.postMessage({
      decimals: 18,
      allowList: { [address]: 10 },
    });
  };

  return { processCreatorAllowlist };
};
