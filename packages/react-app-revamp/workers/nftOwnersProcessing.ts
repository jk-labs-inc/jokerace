import { MAX_ROWS } from "@helpers/csvConstants";
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
}

self.onmessage = (event: MessageEvent<EventData>) => {
  const { ownersData, voteCalculationMethod, votesPerUnit, minTokensRequired } = event.data;
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

      if (voteCalculationMethod === "token") {
        totalVotes = numTokens * votesPerUnit;
      } else if (voteCalculationMethod === "token holder") {
        totalVotes = owner.tokenBalances.length > 0 ? votesPerUnit : 0;
      }

      ownersBalancesRecord[ownerAddress] = totalVotes;
    }

    if (qualifiedOwnersCount >= MAX_ROWS) {
      self.postMessage({
        error:
          "NFT collection has more than 100k holders with specified minimum NFTs required, which is not supported.",
      });
      return;
    }
  }

  self.postMessage(ownersBalancesRecord);
};
