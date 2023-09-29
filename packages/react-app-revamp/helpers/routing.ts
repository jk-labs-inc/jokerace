import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import router from "next/router";

export function goToProposalPage(chain: string, address: string, submission: string) {
  const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", chain)
    .replace("[address]", address)
    .replace("[submission]", submission);

  router.push(path);
}

export function getProposalPagePath(chain: string, address: string, submission: string): string {
  const path = ROUTE_CONTEST_PROPOSAL.replace("[chain]", chain)
    .replace("[address]", address)
    .replace("[submission]", submission);

  return path;
}
