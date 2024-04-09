import { serverConfig } from "@config/wagmi/server";
import { readContract } from "@wagmi/core";

export async function getProposalId(proposal: any, contractConfig: any) {
  const result = (await readContract(serverConfig, {
    ...contractConfig,
    functionName: "hashProposal",
    args: [proposal],
  })) as bigint;

  return result.toString();
}
