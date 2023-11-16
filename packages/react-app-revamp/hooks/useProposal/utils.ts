import { shuffle } from "lodash";

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
      // Implement logic for sorting by votes if necessary
      return listProposalsIds;
    default:
      return listProposalsIds; // Default case
  }
}
