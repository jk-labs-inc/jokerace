import { MAX_ROWS } from "@helpers/csvConstants";
import { SubmissionInvalidEntry } from "@helpers/csvTypes";
import { addressRegex } from "@helpers/regex";
import { canUploadLargeAllowlist } from "lib/vip";

self.onmessage = async (event: MessageEvent) => {
  const { data, userAddress } = event.data;
  const addressData: string[] = [];
  const invalidEntries: SubmissionInvalidEntry[] = [];
  const addressCount: Map<string, number> = new Map();
  const unexpectedHeaders = ["address"];
  const duplicates = new Set();

  if (data.length > MAX_ROWS) {
    const hasLargeUploadPermission = userAddress ? await canUploadLargeAllowlist(userAddress, data.length) : false;
    if (!hasLargeUploadPermission) {
      self.postMessage({ data: {}, invalidEntries, error: { kind: "limitExceeded" } });
      return;
    }
  }

  if (data[0].some((value: any) => unexpectedHeaders.includes(value.toString().toLowerCase()))) {
    self.postMessage({
      data: {},
      invalidEntries,
      error: {
        kind: "unexpectedHeaders",
      },
    });
    return;
  }

  const expectedColumns = 1;
  if (data[0].length !== expectedColumns) {
    self.postMessage({
      data: [],
      invalidEntries,
      error: { kind: "missingColumns" },
    });
    return;
  }

  // first check: identify duplicates and validate addresses
  for (const row of data) {
    const input = row[0];

    if (!addressRegex.test(input)) {
      continue;
    }

    let address = input;
    const count = addressCount.get(address) || 0;
    addressCount.set(address, count + 1);
  }

  addressCount.forEach((count, address) => {
    if (count > 1) {
      // ff an address appears more than once, it's a duplicate
      duplicates.add(address);
      invalidEntries.push({ address, error: true });
    }
  });

  // if duplicates were found, we stop here and report
  if (duplicates.size > 0) {
    self.postMessage({
      data: [],
      invalidEntries,
      error: { kind: "duplicates" },
    });
    return;
  }

  // no duplicates found, proceed to check for invalid addresses
  for (const row of data) {
    const address = row[0];
    const { error } = processRowData(row);
    if (error) {
      invalidEntries.push({ address, error });
    } else {
      addressData.push(address);
    }
  }

  self.postMessage({
    data: addressData,
    invalidEntries,
    error: { kind: invalidEntries.length ? "invalidEntries" : "" },
  });
};

const processRowData = (row: any[]): { address: string; error: boolean } => {
  const address = row[0];
  let error = false;

  if (!addressRegex.test(address)) {
    error = true;
  }

  return { address, error };
};
