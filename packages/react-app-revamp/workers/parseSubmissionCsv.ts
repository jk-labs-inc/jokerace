import { MAX_ROWS } from "@helpers/csvConstants";
import { SubmissionInvalidEntry } from "@helpers/csvTypes";
import { canUploadLargeAllowlist } from "lib/vip";
import { getAddress } from "viem";

self.onmessage = async (event: MessageEvent) => {
  const { data, userAddress } = event.data;
  const addressData: string[] = [];
  const invalidEntries: SubmissionInvalidEntry[] = [];
  const addressCount: Map<string, number> = new Map();
  const unexpectedHeaders = ["address"];
  let hasDuplicates = false;

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

  // first check: identify duplicates
  for (const row of data) {
    const address = row[0];
    const count = addressCount.get(address) || 0;
    addressCount.set(address, count + 1);
    // if this address was seen before, mark as duplicate but do handle it later
    if (count > 0) {
      hasDuplicates = true;
      invalidEntries.push({ address, error: "duplicate" });
    }
  }

  // ff duplicates were found, we stop here.
  if (hasDuplicates) {
    self.postMessage({
      data: [],
      invalidEntries,
    });
    return;
  }

  // no duplicates found, proceed to check for invalid addresses
  for (const row of data) {
    const address = row[0];
    // reuse the previously collected addresses since we know they are unique now
    if (addressCount.get(address) === 1) {
      const { error } = processRowData(row);
      if (error) {
        invalidEntries.push({ address, error: "invalidAddress" });
      } else {
        addressData.push(address);
      }
    }
  }

  self.postMessage({
    data: addressData,
    invalidEntries,
  });
};

const processRowData = (row: any[]): { address: string; error: string } => {
  const address = row[0];
  let error = "";

  try {
    getAddress(address);
  } catch (e) {
    error = "invalidAddress";
  }

  return { address, error };
};
