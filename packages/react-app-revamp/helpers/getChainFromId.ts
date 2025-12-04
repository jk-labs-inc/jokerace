import { chains } from "@config/wagmi";

export function getChainFromId(chainId: number) {
  return chains.find(chain => chain.id === chainId);
}
