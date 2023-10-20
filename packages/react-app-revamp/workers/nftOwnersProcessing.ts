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
}

self.onmessage = (event: MessageEvent<EventData>) => {
  const { ownersData, voteCalculationMethod, votesPerUnit } = event.data;
  const ownersBalancesRecord: OwnersBalancesRecord = {};

  for (const owner of ownersData) {
    const ownerAddress: string = owner.ownerAddress;
    let totalVotes: number = 0;

    if (voteCalculationMethod === "token") {
      // scenario 1: X votes per NFT
      totalVotes = owner.tokenBalances.reduce(
        (sum: number, tokenBalance: TokenBalance) => sum + tokenBalance.balance * votesPerUnit,
        0,
      );
    } else if (voteCalculationMethod === "token holder") {
      // scenario 2: X votes per unique holder of an NFT
      totalVotes = owner.tokenBalances.length > 0 ? votesPerUnit : 0;
    }

    ownersBalancesRecord[ownerAddress] = totalVotes;
  }

  self.postMessage(ownersBalancesRecord);
};
