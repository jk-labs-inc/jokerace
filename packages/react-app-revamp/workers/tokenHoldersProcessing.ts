import { formatEther } from "@ethersproject/units";
import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";
import { VoteCalculationMethod } from "lib/permissioning";

interface TokenHolder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

interface EventData {
  tokenHolders: TokenHolder[];
  voteCalculationMethod: VoteCalculationMethod;
  votesPerUnit: number;
  minTokensRequired: number;
  eventType: "voting" | "submission";
}

interface OwnersBalancesRecord {
  [ownerAddress: string]: number;
}

const BASE_LIMIT = 100000;

self.onmessage = (event: MessageEvent<EventData>) => {
  const { tokenHolders, voteCalculationMethod, votesPerUnit, minTokensRequired, eventType } = event.data;
  const ownersBalancesRecord: OwnersBalancesRecord = {};
  let qualifiedHoldersCount = 0;

  for (const holder of tokenHolders) {
    const holderAddress: string = holder.TokenHolderAddress;
    const tokenQuantityInWei = holder.TokenHolderQuantity;

    const tokenQuantityInEther = parseFloat(formatEther(tokenQuantityInWei)).toFixed(4);
    const formattedTokenQuantity = parseFloat(tokenQuantityInEther);

    if (formattedTokenQuantity >= minTokensRequired) {
      qualifiedHoldersCount++;
      let totalVotes: number = 0;

      if (eventType === "voting") {
        if (voteCalculationMethod === "token") {
          totalVotes = formattedTokenQuantity * votesPerUnit;
        } else if (voteCalculationMethod === "token holder") {
          totalVotes = votesPerUnit;
        }
      } else if (eventType === "submission") {
        totalVotes = 10;
      }

      ownersBalancesRecord[holderAddress] = totalVotes;
    }

    if (qualifiedHoldersCount >= MAX_ROWS) {
      const errorMessage = `cannot support over ${formatNumber(BASE_LIMIT)} ${
        eventType === "voting" ? "voters" : "submitters"
      }: raise min. tokens required`;

      self.postMessage({
        error: errorMessage,
      });
      return;
    }
  }

  self.postMessage(ownersBalancesRecord);
};
