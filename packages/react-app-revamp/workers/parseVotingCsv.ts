import { MAX_ROWS, MAX_VOTES } from "@helpers/csvConstants";
import { VotingInvalidEntry } from "@helpers/csvTypes";
import { canUploadLargeAllowlist } from "lib/vip";
import { getAddress } from "viem";

interface ParseVotingCsvPayload {
  data: any[];
  userAddress: string | undefined;
}

const processRowData = (row: any[]) => {
  let error: VotingInvalidEntry["error"] | null = null;
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

self.onmessage = async (event: MessageEvent<ParseVotingCsvPayload>) => {
  const { data, userAddress } = event.data;
  const votesData: Record<string, number> = {};
  const invalidEntries: VotingInvalidEntry[] = [];
  const addresses: Set<string> = new Set();
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
