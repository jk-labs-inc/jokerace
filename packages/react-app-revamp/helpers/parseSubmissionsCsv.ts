import { getAddress } from "ethers/lib/utils";
import Papa from "papaparse";

export type InvalidEntry = {
  address: string;
  error: boolean;
};

export type ParseCsvResult = {
  data: string[];
  invalidEntries: InvalidEntry[];
  missingHeaders?: string[];
  limitExceeded?: boolean;
  parseError?: Error;
};

const MAX_ROWS = 10000; // 10k for now

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const requiredHeaders = ["address"];
  const csvHeaders = results.meta.fields || []; // Default to an empty array if fields are undefined
  const missingHeaders = requiredHeaders.filter(header => !csvHeaders.includes(header));

  const unnecessaryHeaders = csvHeaders.length > requiredHeaders.length;

  if (unnecessaryHeaders) {
    missingHeaders.push("Unnecessary headers detected");
  }

  if (missingHeaders.length > 0) {
    return {
      data: [],
      invalidEntries: [],
      missingHeaders,
    };
  }

  const data = results.data as Array<{ address: string }>;
  const addressData: string[] = [];
  const invalidEntries: InvalidEntry[] = [];

  if (data.length > MAX_ROWS) {
    return {
      data: [],
      invalidEntries: [],
      limitExceeded: true,
    };
  }

  for (const { address } of data) {
    let error: boolean = false;

    try {
      getAddress(address);
    } catch (e) {
      error = true;
    }

    if (error) {
      invalidEntries.push({ address: address, error });
    } else {
      addressData.push(address);
    }
  }

  return {
    data: addressData,
    invalidEntries,
  };
};

export const parseCsvSubmissions = (file: File): Promise<ParseCsvResult> => {
  return new Promise(resolve => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: header => header.toLowerCase().replace(/\s/g, ""),
      complete: results => {
        resolve(processResults(results));
      },
      error: error => resolve({ data: [], invalidEntries: [], parseError: error }),
    });
  });
};
