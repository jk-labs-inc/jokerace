import { getAddress } from "ethers/lib/utils";
import Papa from "papaparse";

export type InvalidEntry = {
  address: string;
  error: boolean;
};

export type ParseCsvResult = {
  data: string[];
  invalidEntries: InvalidEntry[];
  limitExceeded?: boolean;
  missingColumns?: boolean;
  parseError?: Error;
};

const MAX_ROWS = 10000; // 10k for now

const processResults = (results: Papa.ParseResult<any>): ParseCsvResult => {
  const data = results.data as Array<any>;
  const addressData: string[] = [];
  const invalidEntries: InvalidEntry[] = [];

  if (data.length > MAX_ROWS) {
    return {
      data: [],
      invalidEntries: [],
      limitExceeded: true,
    };
  }

  // Ensure that the CSV has the correct number of columns (1)
  const expectedColumns = 1;
  const firstRow = data[0];
  if (firstRow.length !== expectedColumns) {
    return {
      data: [],
      invalidEntries: [],
      missingColumns: true,
    };
  }

  for (const row of data) {
    let error: boolean = false;
    const address = row[0];

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
      header: false, // Update this to be false since we don't have headers
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        resolve(processResults(results));
      },
      error: error => resolve({ data: [], invalidEntries: [], parseError: error }),
    });
  });
};
