import { chains } from "@config/wagmi/server";

export function getChainId(chainName: string) {
  return chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.id || 1;
}
