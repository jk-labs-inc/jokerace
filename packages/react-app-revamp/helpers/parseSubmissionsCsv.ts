import Papa from "papaparse";

export type InvalidEntry = {
  address: string;
  error: boolean;
};

export type ValidationError =
  | { kind: "missingColumns" }
  | { kind: "limitExceeded" }
  | { kind: "duplicates" }
  | { kind: "parseError"; error: Error };

export type ParseCsvResult = {
  data: string[];
  invalidEntries: InvalidEntry[];
  error?: ValidationError;
};

export const MAX_ROWS = 100000; // 100k for now

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
