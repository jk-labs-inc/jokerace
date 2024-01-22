import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";
import { VoteCalculationMethod } from "lib/permissioning";

interface TokenBalance {
  tokenId: string;
  balance: number;
}

interface OwnerData {
  ownerAddress: string;
  tokenBalances: TokenBalance[];
}

interface OwnersBalancesRecord {
  [ownerAddress: string]: number;
}

interface EventData {
  ownersData: OwnerData[];
  voteCalculationMethod: VoteCalculationMethod;
  votesPerUnit: number;
  minTokensRequired: number;
  eventType: "voting" | "submission";
}

const BASE_LIMIT = 100000;

self.onmessage = (event: MessageEvent<EventData>) => {
  const { ownersData, voteCalculationMethod, votesPerUnit, minTokensRequired, eventType } = event.data;
  const ownersBalancesRecord: OwnersBalancesRecord = {};
  let qualifiedOwnersCount = 0;

  for (const owner of ownersData) {
    const ownerAddress: string = owner.ownerAddress;
    const numTokens = owner.tokenBalances.reduce(
      (sum: number, tokenBalance: TokenBalance) => sum + tokenBalance.balance,
      0,
    );

    if (numTokens >= minTokensRequired) {
      qualifiedOwnersCount++;
      let totalVotes: number = 0;

      if (eventType === "voting") {
        if (voteCalculationMethod === "token") {
          totalVotes = numTokens * votesPerUnit;
        } else if (voteCalculationMethod === "token holder") {
          totalVotes = owner.tokenBalances.length > 0 ? votesPerUnit : 0;
        }
      } else if (eventType === "submission") {
        totalVotes = 10; // hardcoded to 10 for submission allowlists
      }

      ownersBalancesRecord[ownerAddress] = totalVotes;
    }

    if (qualifiedOwnersCount >= MAX_ROWS) {
      const errorMessage = `cannot support over ${formatNumber(BASE_LIMIT)} ${
        eventType === "voting" ? "voters" : "submitters"
      }: raise min. NFTs required`;

      self.postMessage({
        error: errorMessage,
      });
      return;
    }
  }

  self.postMessage(ownersBalancesRecord);
};
