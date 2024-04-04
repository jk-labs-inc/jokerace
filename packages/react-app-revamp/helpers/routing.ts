import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";

export function getProposalPagePath(chain: string, address: string, submission: string): string {
  const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", chain)
    .replace("[address]", address)
    .replace("[submission]", submission);

  return path;
}
