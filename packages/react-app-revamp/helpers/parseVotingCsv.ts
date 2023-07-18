import { getAddress } from "ethers/lib/utils";
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
  | { kind: "over18Decimal" }
  | { kind: "parseError"; error: Error };

export type ParseCsvResult = {
  data: Record<string, number>;
  invalidEntries: InvalidEntry[];
  error?: ValidationError;
};

const MAX_ROWS = 100000; // 100k for now

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const data = results.data as Array<any>;
  const votesData: Record<string, number> = {};
  const invalidEntries: InvalidEntry[] = [];
  const addresses: Set<string> = new Set();

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
    const numberOfVotes = row[1];

    if (addresses.has(address)) {
      return {
        data: {},
        invalidEntries,
        error: { kind: "duplicates" },
      };
    } else {
      addresses.add(address);
    }

    const decimalIndex = numberOfVotes.toString().indexOf(".");
    if (decimalIndex !== -1 && numberOfVotes.toString().length - decimalIndex - 1 > 18) {
      return {
        data: {},
        invalidEntries,
        error: { kind: "over18Decimal" },
      };
    }

    try {
      getAddress(address);
    } catch (e) {
      error = "address";
    }

    if (typeof numberOfVotes !== "number" || numberOfVotes <= 0) {
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
      error: error => resolve({ data: {}, invalidEntries: [], error: { kind: "parseError", error } }),
    });
  });
};
