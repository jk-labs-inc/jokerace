import { getWagmiConfig } from "@getpara/evm-wallet-connectors";
import { readContract } from "@wagmi/core";

export async function getProposalId(proposal: any, contractConfig: any) {
  const result = (await readContract(getWagmiConfig(), {
    ...contractConfig,
    functionName: "hashProposal",
    args: [proposal],
  })) as bigint;

  return result.toString();
}
