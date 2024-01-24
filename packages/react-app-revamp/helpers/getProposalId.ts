import { config } from "@config/wagmi";
import { readContract } from "@wagmi/core";

export async function getProposalId(proposal: any, contractConfig: any) {
  const result = (await readContract(config, {
    ...contractConfig,
    functionName: "hashProposal",
    args: [proposal],
  })) as bigint;

  return result.toString();
}
