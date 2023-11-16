import { shuffle } from "lodash";
import { ProposalCore } from "./store";

export type SortOptions = "leastRecent" | "mostRecent" | "random" | "votes";

export function mapResultToStringArray(result: any): string[] {
  if (Array.isArray(result)) {
    return result.map((id: bigint) => id.toString());
  } else {
    return [result.toString()];
  }
}

export function sortProposals(sortBy: SortOptions, listProposalsIds: string[]): Array<string> {
  switch (sortBy) {
    case "mostRecent":
      return [...listProposalsIds].reverse();
    case "random":
      return shuffle([...listProposalsIds]);
    case "votes":
      // todo: add logic for sorting by votes
      return listProposalsIds;
    default:
      return listProposalsIds;
  }
}

export function formatProposalData(proposals: ProposalCore[]) {
  // Assign ranks and check for ties
  let currentRank = 0;
  let previousVotes: number | null = null;

  return proposals.map((proposal, index) => {
    if (proposal.netVotes > 0) {
      if (proposal.netVotes !== previousVotes) {
        currentRank++;
        previousVotes = proposal.netVotes;
      }
      proposal.rank = currentRank;
      // Determine if the current proposal is tied with another
      proposal.isTied = proposals.some(
        (other, otherIndex) => other.netVotes === proposal.netVotes && otherIndex !== index,
      );
    } else {
      proposal.rank = 0;
      proposal.isTied = false;
    }
    return proposal;
  });
}
