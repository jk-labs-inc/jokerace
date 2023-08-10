import Papa from "papaparse";
import { getAddress } from "viem";

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
const MAX_VOTES = 1e9; // 1 billion

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const data = results.data as Array<any>;
  const votesData: Record<string, number> = {};
  const invalidEntries: InvalidEntry[] = [];
  const addresses: Set<string> = new Set();
  let roundedToZeroCount = 0;

  if (data.length > MAX_ROWS) {
    return {
      data: {},
      invalidEntries,
      error: { kind: "limitExceeded" },
    };
  }

  const expectedColumns = 2;
  const firstRow = data[0];
  if (firstRow.length !== expectedColumns) {
    return {
      data: {},
      invalidEntries,
      error: { kind: "missingColumns" },
    };
  }

  for (const row of data) {
    let error: InvalidEntry["error"] | null = null;
    const address = row[0];
    let numberOfVotes = row[1];

    if (typeof numberOfVotes === "number") {
      numberOfVotes = parseFloat(row[1].toFixed(4));
    } else {
      numberOfVotes = parseFloat(parseFloat(row[1].toString().replaceAll(",", "")).toFixed(4));
    }

    if (addresses.has(address)) {
      return {
        data: {},
        invalidEntries,
        error: { kind: "duplicates" },
      };
    } else {
      addresses.add(address);
    }

    try {
      getAddress(address);
    } catch (e) {
      error = "address";
    }

    if (typeof numberOfVotes !== "number" || numberOfVotes >= MAX_VOTES) {
      error = error ? "both" : "votes";
    }

    if (error) {
      invalidEntries.push({ address: address, votes: numberOfVotes, error });
    } else {
      if (numberOfVotes !== 0) {
        votesData[address] = numberOfVotes;
      } else {
        roundedToZeroCount++;
      }
    }
  }

  if (roundedToZeroCount === data.length) {
    return {
      data: {},
      invalidEntries,
      error: { kind: "allZero" },
    };
  }

  return {
    data: votesData,
    invalidEntries,
    roundedZeroCount: roundedToZeroCount,
  };
};

export const parseCsvVoting = (file: File): Promise<ParseCsvResult> => {
  return new Promise(resolve => {
    Papa.parse(file, {
      header: false,
      dynamicTyping: true,
      worker: true,
      skipEmptyLines: true,
      complete: results => {
        resolve(processResults(results));
      },
      error: error => resolve({ data: {}, invalidEntries: [], error: { kind: "parseError", error } }),
    });
  });
};
