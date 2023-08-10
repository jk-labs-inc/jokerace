import { InvalidEntry, MAX_ROWS, MAX_VOTES } from "@helpers/parseVotingCsv";
import { getAddress } from "viem";

interface ParseVotingCsvPayload {
  data: any[];
}

const processRowData = (row: any[]) => {
  let error: InvalidEntry["error"] | null = null;
  const address = row[0];
  let numberOfVotes =
    typeof row[1] === "number"
      ? parseFloat(row[1].toFixed(4))
      : parseFloat(parseFloat(row[1].toString().replaceAll(",", "")).toFixed(4));
  try {
    getAddress(address);
  } catch (e) {
    error = "address";
  }

  if (typeof numberOfVotes !== "number" || numberOfVotes >= MAX_VOTES) {
    error = error ? "both" : "votes";
  }

  return { address, numberOfVotes, error };
};

self.onmessage = (event: MessageEvent<ParseVotingCsvPayload>) => {
  const { data } = event.data;
  const votesData: Record<string, number> = {};
  const invalidEntries: InvalidEntry[] = [];
  const addresses: Set<string> = new Set();
  let roundedZeroCount = 0;

  if (data.length > MAX_ROWS) {
    self.postMessage({ data: {}, invalidEntries, error: { kind: "limitExceeded" } });
    return;
  }

  if (data[0].length !== 2) {
    self.postMessage({ data: {}, invalidEntries, error: { kind: "missingColumns" } });
    return;
  }

  data.forEach(row => {
    if (addresses.has(row[0])) {
      self.postMessage({ data: {}, invalidEntries, error: { kind: "duplicates" } });
      return;
    }

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

  self.postMessage({ data: votesData, invalidEntries, roundedZeroCount });
};
