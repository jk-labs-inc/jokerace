import { chainsImages } from "@config/wagmi";

export function getChainLogo(chainName: string) {
  return chainsImages[chainName.toLowerCase()];
}
