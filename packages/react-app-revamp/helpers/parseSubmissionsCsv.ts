import { getAddress } from "ethers/lib/utils";
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

const MAX_ROWS = 10000; // 10k for now

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const data = results.data as Array<any>;
  const addressData: string[] = [];
  const invalidEntries: InvalidEntry[] = [];
  const addresses: Set<string> = new Set();

  if (data.length > MAX_ROWS) {
    return {
      data: [],
      invalidEntries,
      error: { kind: "limitExceeded" },
    };
  }

  // Ensure that the CSV has the correct number of columns (1)
  const expectedColumns = 1;
  const firstRow = data[0];
  if (firstRow.length !== expectedColumns) {
    return {
      data: [],
      invalidEntries,
      error: { kind: "missingColumns" },
    };
  }

  for (const row of data) {
    let error: boolean = false;
    const address = row[0];

    if (addresses.has(address)) {
      return {
        data: [],
        invalidEntries,
        error: { kind: "duplicates" },
      };
    } else {
      addresses.add(address);
    }

    try {
      getAddress(address);
    } catch (e) {
      error = true;
    }

    if (error) {
      invalidEntries.push({ address, error });
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
      header: false,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        resolve(processResults(results));
      },
      error: error => resolve({ data: [], invalidEntries: [], error: { kind: "parseError", error } }),
    });
  });
};
