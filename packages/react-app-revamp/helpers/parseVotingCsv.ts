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
  missingHeaders?: string[];
  parseError?: Error;
};

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const requiredHeaders = ["address", "numberOfVotes"];
  const missingHeaders = requiredHeaders.filter(header => !results.meta.fields?.includes(header));
  if (missingHeaders.length > 0) {
    return {
      data: {},
      invalidEntries: [],
      missingHeaders,
    };
  }

  const data = results.data as Array<{ address: string; numberOfVotes: number }>;
  const votesData: Record<string, number> = {};
  const invalidEntries: InvalidEntry[] = [];

  for (const { address, numberOfVotes } of data) {
    let error: InvalidEntry["error"] | null = null;

    try {
      getAddress(address);
    } catch (e) {
      error = "address";
    }

    if (numberOfVotes < 0) {
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
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: header => {
        const transformedHeader = header.toLowerCase().replace(/\s/g, "");
        return transformedHeader === "numberofvotes" ? "numberOfVotes" : transformedHeader;
      },
      complete: results => {
        resolve(processResults(results));
      },
      error: error => resolve({ data: {}, invalidEntries: [], parseError: error }),
    });
  });
};
