import { chains } from "@config/wagmi/chains";

export function getChainId(chainName: string) {
  return chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.id || 1;
}
