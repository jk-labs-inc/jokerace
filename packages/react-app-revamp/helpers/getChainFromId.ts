import { chains } from "@config/wagmi/chains";

export function getChainFromId(chainId: number) {
  return chains.find(chain => chain.id === chainId);
}
