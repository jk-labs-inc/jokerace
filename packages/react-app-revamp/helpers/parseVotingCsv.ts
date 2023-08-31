import Papa from "papaparse";

export type InvalidEntry = {
  address: string;
  votes: number;
  error: "address" | "votes" | "both";
};

export type ValidationError =
  | { kind: "missingColumns" }
  | { kind: "limitExceeded" }
  | { kind: "duplicates" }
  | { kind: "allZero" }
  | { kind: "parseError"; error: Error };

export type ParseCsvResult = {
  data: Record<string, number>;
  invalidEntries: InvalidEntry[];
  roundedZeroCount?: number;
  error?: ValidationError;
};

export const MAX_ROWS = 100000; // 100k for now
export const MAX_VOTES = 1e9; // 1 billion

export const parseCsvVoting = (file: File, userAddress: string | undefined): Promise<ParseCsvResult> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("/workers/parseVotingCsv", import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      const payload: ParseCsvResult = event.data;

      if (payload.error) {
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
