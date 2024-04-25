import { MAX_ROWS, MAX_VOTES } from "@helpers/csvConstants";
import { VotingInvalidEntry } from "@helpers/csvTypes";
import { addressRegex } from "@helpers/regex";
import { canUploadLargeAllowlist } from "lib/vip";

interface ParseVotingCsvPayload {
  data: any[];
  userAddress: string | undefined;
}

const processRowData = (row: any[]) => {
  let error: VotingInvalidEntry["error"] | null = null;
  const address = row[0];
  let numberOfVotes =
    typeof row[1] === "number"
      ? Math.round(row[1])
      : Math.round(parseFloat(parseFloat(row[1].toString().replaceAll(",", "")).toString()));

  if (!addressRegex.test(address)) {
    error = "address";
  }

  if (typeof numberOfVotes !== "number" || numberOfVotes >= MAX_VOTES || numberOfVotes < 0 || isNaN(numberOfVotes)) {
    error = error ? "both" : "votes";
  }

  return { address, numberOfVotes, error };
};

self.onmessage = async (event: MessageEvent<ParseVotingCsvPayload>) => {
  const { data, userAddress } = event.data;
  const votesData: Record<string, number> = {};
  const invalidEntries: VotingInvalidEntry[] = [];
  const addresses: Set<string> = new Set();
  const addressCount: Map<string, number> = new Map();
  const duplicates = new Set<string>();

  const unexpectedHeaders = ["address", "number of votes", "numVotes"];
  let roundedZeroCount = 0;

  if (data.length > MAX_ROWS) {
    if (userAddress) {
      const hasLargeUploadPermission = await canUploadLargeAllowlist(userAddress, data.length);
      if (!hasLargeUploadPermission) {
        self.postMessage({ data: {}, invalidEntries, error: { kind: "limitExceeded" } });
        return;
      }
    } else {
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

  if (data[0].length !== 2) {
    self.postMessage({ data: {}, invalidEntries, error: { kind: "missingColumns" } });
    return;
  }

  // first check: identify duplicates and validate addresses
  for (const row of data) {
    const inputAddress = row[0];
    if (!addressRegex.test(inputAddress)) {
      continue;
    }

    const count = addressCount.get(inputAddress) || 0;
    addressCount.set(inputAddress, count + 1);
    if (count > 0) {
      duplicates.add(inputAddress);
    }
  }

  // if duplicates were found, we stop here and report
  if (duplicates.size > 0) {
    for (const duplicateAddress of duplicates) {
      invalidEntries.push({ address: duplicateAddress, error: "address", votes: 0 });
    }

    self.postMessage({ data: {}, invalidEntries, error: { kind: "duplicates" } });
    return;
  }

  data.forEach(row => {
    const { address, numberOfVotes, error } = processRowData(row);

    addresses.add(address);
    if (error) {
      invalidEntries.push({ address, votes: numberOfVotes, error });
    } else if (numberOfVotes !== 0) {
      votesData[address] = numberOfVotes;
    } else {
      roundedZeroCount++;
    }
  });

  if (roundedZeroCount === data.length) {
    self.postMessage({ data: {}, invalidEntries, error: { kind: "allZero" } });
    return;
  }

  self.postMessage({
    data: votesData,
    invalidEntries,
    roundedZeroCount,
    error: invalidEntries.length ? { kind: "invalidEntries" } : null,
  });
};
