import Papa from "papaparse";
import { VotingInvalidEntry, VotingValidationError } from "./csvTypes";

export type ParseCsvResult = {
  data: Record<string, number>;
  invalidEntries: VotingInvalidEntry[];
  roundedZeroCount?: number;
  error?: VotingValidationError;
};

const MODAL_ERROR_DUPLICATES = "duplicates";
const MODAL_ERROR_INVALID_ENTRIES = "invalidEntries";

export const parseCsvVoting = (file: File, userAddress: string | undefined): Promise<ParseCsvResult> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("/workers/parseVotingCsv", import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      const payload: ParseCsvResult = event.data;

      if (payload.error?.kind === MODAL_ERROR_DUPLICATES || payload.error?.kind === MODAL_ERROR_INVALID_ENTRIES) {
        resolve({
          data: payload.data,
          invalidEntries: payload.invalidEntries,
          roundedZeroCount: payload.roundedZeroCount,
          error: payload.error,
        });
      } else if (payload.error) {
        resolve({
          data: {},
          invalidEntries: payload.invalidEntries,
          error: payload.error,
          roundedZeroCount: payload.roundedZeroCount,
        });
      } else {
        resolve({
          data: payload.data,
          invalidEntries: payload.invalidEntries,
          roundedZeroCount: payload.roundedZeroCount,
        });
      }

      worker.terminate();
    };

    worker.onerror = err => {
      reject({ data: {}, invalidEntries: [], error: { kind: "parseError", error: err } });

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
        reject({ data: {}, invalidEntries: [], error: { kind: "parseError", error } });

        worker.terminate();
      },
    });
  });
};
