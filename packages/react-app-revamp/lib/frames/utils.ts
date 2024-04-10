import { chains } from "@config/wagmi/server";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export type SupportedChainId = 1 | 10 | 8453 | 84532 | 7777777;
export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [1, 10, 8453, 84532, 7777777];

export function isSupportedChainId(chainId: any): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

export const getChainId = (chain: string): number => {
  const chainId = chains.find(
    (c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain.toLowerCase(),
  )?.id;

  return chainId ?? 1;
};
