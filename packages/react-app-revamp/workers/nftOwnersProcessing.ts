import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";
import { VoteCalculationMethod } from "lib/permissioning";

interface Token {
  tokenId: string;
  balance: number;
}

interface OwnerData {
  ownerAddress: string;
  tokenBalances: Token[];
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
  tokenId: number | null;
}

const BASE_LIMIT = 100000;

self.onmessage = (event: MessageEvent<EventData>) => {
  const { ownersData, voteCalculationMethod, votesPerUnit, minTokensRequired, eventType, tokenId } = event.data;
  const ownersBalancesRecord: OwnersBalancesRecord = {};
  let qualifiedOwnersCount = 0;

  for (const owner of ownersData) {
    const ownerAddress: string = owner.ownerAddress;
    let filteredTokenBalances = owner.tokenBalances;

    if (tokenId !== null) {
      filteredTokenBalances = owner.tokenBalances.filter(tokenBalance => Number(tokenBalance.tokenId) === tokenId);
    }

    const numTokens = filteredTokenBalances.reduce((sum: number, tokenBalance: Token) => sum + tokenBalance.balance, 0);

    if (numTokens >= minTokensRequired) {
      qualifiedOwnersCount++;
      let totalVotes: number = 0;

      if (eventType === "voting") {
        if (voteCalculationMethod === "token") {
          totalVotes = numTokens * votesPerUnit;
        } else if (voteCalculationMethod === "token holder") {
          totalVotes = filteredTokenBalances.length > 0 ? votesPerUnit : 0;
        }
      } else if (eventType === "submission") {
        totalVotes = 10; // hardcoded to 10 for submission allowlists
      }

      ownersBalancesRecord[ownerAddress] = totalVotes;
    }

    if (qualifiedOwnersCount === 0) {
      self.postMessage({
        error: "No qualified owners found based on the provided criteria.",
      });
      return;
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
