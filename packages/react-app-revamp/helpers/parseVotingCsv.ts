import { getAddress } from "ethers/lib/utils";
import Papa from "papaparse";

export type InvalidEntry = {
  address: string;
  votes: number;
  error: "address" | "votes" | "both";
};

export type ParseCsvResult = {
  data: Record<string, number>;
  invalidEntries: InvalidEntry[];
  missingColumns?: boolean;
  limitExceeded?: boolean;
  parseError?: Error;
};

const MAX_ROWS = 10000; // 10k for now

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const data = results.data as Array<any>;
  const votesData: Record<string, number> = {};
  const invalidEntries: InvalidEntry[] = [];

  if (data.length > MAX_ROWS) {
    return {
      data: {},
      invalidEntries: [],
      limitExceeded: true,
    };
  }

  // Ensure that the CSV has the correct number of columns (2)
  const expectedColumns = 2;
  const firstRow = data[0];
  if (firstRow.length !== expectedColumns) {
    return {
      data: {},
      invalidEntries: [],
      missingColumns: true,
    };
  }

  for (const row of data) {
    let error: InvalidEntry["error"] | null = null;
    const address = row[0];
    const numberOfVotes = row[1];

    try {
      getAddress(address);
    } catch (e) {
      error = "address";
    }

    if (typeof numberOfVotes !== "number" || numberOfVotes < 0) {
      error = error ? "both" : "votes";
    }

    if (error) {
      invalidEntries.push({ address: address, votes: numberOfVotes, error });
    } else {
      votesData[address] = numberOfVotes;
    }
  }

  return {
    data: votesData,
    invalidEntries,
  };
};

export const parseCsvVoting = (file: File): Promise<ParseCsvResult> => {
  return new Promise(resolve => {
    Papa.parse(file, {
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        resolve(processResults(results));
      },
      error: error => resolve({ data: {}, invalidEntries: [], parseError: error }),
    });
  });
};
