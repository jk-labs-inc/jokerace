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
    console.log("merkleRoot", merkleRoot);
    console.log("recipients", recipients);
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

  const processCreatorAllowlist = (address: string | undefined): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!address) {
        resolve();
        return;
      }

      console.log("address", address);

      const worker = initializeWorker();

      // Override the worker message handler to resolve the promise
      worker.onmessage = (event: MessageEvent<WorkerMessageData>) => {
        const { merkleRoot, recipients } = event.data;
        console.log("merkleRoot", merkleRoot);
        console.log("recipients", recipients);
        setSubmissionMerkle({ merkleRoot, submitters: recipients });
        terminateWorker(worker);
        resolve();
      };

      // Override the error handler to reject the promise
      worker.onerror = (error: ErrorEvent) => {
        console.error("Worker error:", error);
        terminateWorker(worker);
        reject(new Error(`Worker error: ${error.message}`));
      };

      worker.postMessage({
        decimals: 18,
        allowList: { [address]: 10 },
      });
    });
  };

  return { processCreatorAllowlist };
};
