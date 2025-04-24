import { chains } from "@config/wagmi";

export const getNativeTokenInfo = (chainId: number) => {
  const matchingChain = chains.find(chain => chain.id === chainId);

  if (!matchingChain) {
    return {
      symbol: "ETH",
      decimals: 18,
    };
  }

  return {
    symbol: matchingChain.nativeCurrency?.symbol || "ETH",
    decimals: matchingChain.nativeCurrency?.decimals || 18,
  };
};
