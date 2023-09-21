import Papa from "papaparse";
import { SubmissionInvalidEntry, SubmissionValidationError } from "./csvTypes";

export type ParseCsvResult = {
  data: string[];
  invalidEntries: SubmissionInvalidEntry[];
  error?: SubmissionValidationError;
};

export const parseSubmissionCsv = (file: File, userAddress: string | undefined): Promise<ParseCsvResult> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("/workers/parseSubmissionCsv", import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      const payload: ParseCsvResult = event.data;
      resolve(payload);

      worker.terminate();
    };

    worker.onerror = err => {
      reject({ data: [], invalidEntries: [], error: { kind: "parseError", error: err } });

      worker.terminate();
    };

    Papa.parse(file, {
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        worker.postMessage({
          data: results.data,
          userAddress: userAddress,
        });
      },
      error: error => {
        reject({ data: [], invalidEntries: [], error: { kind: "parseError", error } });

        worker.terminate();
      },
    });
  });
};
