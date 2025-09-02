import { chains } from "@config/wagmi/server";

export function getChainFromId(chainId: number) {
  return chains.find(chain => chain.id === chainId);
}
