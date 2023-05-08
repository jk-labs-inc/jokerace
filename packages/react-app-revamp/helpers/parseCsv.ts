import Papa from "papaparse";
import { getAddress } from "ethers/lib/utils";

export type InvalidEntry = {
  address: string;
  votes: number;
  error: "address" | "votes" | "both";
};

export type ParseCsvResult = {
  data: Record<string, number>;
  invalidEntries: InvalidEntry[];
  missingHeaders?: string[];
  parseError?: Error;
};

const processResults = (results: Papa.ParseResult<unknown>): ParseCsvResult => {
  const requiredHeaders = ["address", "votes"];
  const missingHeaders = requiredHeaders.filter(header => !results.meta.fields?.includes(header));

  if (missingHeaders.length > 0) {
    return {
      data: {},
      invalidEntries: [],
      missingHeaders,
    };
  }

  const data = results.data as Array<{ address: string; votes: number }>;
  const votesData: Record<string, number> = {};
  const invalidEntries: InvalidEntry[] = [];

  for (const { address, votes } of data) {
    let error: InvalidEntry["error"] | null = null;

    try {
      getAddress(address);
    } catch (e) {
      error = "address";
    }

    if (votes < 0) {
      error = error ? "both" : "votes";
    }

    if (error) {
      invalidEntries.push({ address: address, votes: votes, error });
    } else {
      votesData[address] = votes;
    }
  }

  return {
    data: votesData,
    invalidEntries,
  };
};

export const parseCsv = (file: File): Promise<ParseCsvResult> => {
  return new Promise(resolve => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: header => header.toLowerCase(),
      complete: results => resolve(processResults(results)),
      error: error => resolve({ data: {}, invalidEntries: [], parseError: error }),
    });
  });
};
