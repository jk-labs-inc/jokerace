interface UseWebWorkerProps {
  workerUrl: string;
}

interface WorkerCallbacks {
  onSuccess: (event: MessageEvent) => void;
  onError: (error: ErrorEvent) => void;
}

const useWebWorker = ({ workerUrl }: UseWebWorkerProps) => {
  const initializeWorker = (callbacks: WorkerCallbacks) => {
    const { onSuccess, onError } = callbacks;
    const worker = new Worker(workerUrl);

    worker.onmessage = onSuccess;
    worker.onerror = onError;

    return worker;
  };

  const terminateWorker = (worker: Worker) => {
    if (worker && worker.terminate) {
      worker.terminate();
    }
  };

  return {
    initializeWorker,
    terminateWorker,
  };
};

export default useWebWorker;
