import { chains } from "@config/wagmi";

export function getChainExplorer(chainId: number) {
  return chains.find(chain => chain.id === chainId)?.blockExplorers?.default.url || "";
}
