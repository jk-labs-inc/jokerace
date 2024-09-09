import { chains } from "@config/wagmi";

export const getNativeTokenInfo = (chainId: number) => {
  const { nativeCurrency } = chains.filter(chain => chain.id === chainId)[0];
  return {
    symbol: nativeCurrency?.symbol,
    decimals: nativeCurrency?.decimals,
  };
};
