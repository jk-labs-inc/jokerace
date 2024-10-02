import { MAX_ROWS } from "@helpers/csvConstants";
import { formatNumber } from "@helpers/formatNumber";
import { VoteCalculationMethod } from "lib/permissioning";
import { formatEther, parseUnits } from "viem";

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
  decimals: number;
}

interface OwnersBalancesRecord {
  [ownerAddress: string]: number;
}

const BASE_LIMIT = 100000;

self.onmessage = (event: MessageEvent<EventData>) => {
  const { tokenHolders, voteCalculationMethod, votesPerUnit, minTokensRequired, eventType, decimals } = event.data;
  const ownersBalancesRecord: OwnersBalancesRecord = {};
  let qualifiedHoldersCount = 0;

  const minTokensRequiredInWei = parseUnits(minTokensRequired.toString(), decimals);

  for (const holder of tokenHolders) {
    const holderAddress: string = holder.TokenHolderAddress;
    const tokenQuantityInWei = BigInt(holder.TokenHolderQuantity);

    if (tokenQuantityInWei >= minTokensRequiredInWei) {
      qualifiedHoldersCount++;
      let totalVotes: number = 0;

      if (eventType === "voting") {
        if (voteCalculationMethod === "token") {
          const tokenQuantityInEther = parseFloat(formatEther(tokenQuantityInWei));
          totalVotes = tokenQuantityInEther * votesPerUnit;
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
