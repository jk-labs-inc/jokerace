import { chains } from "@config/wagmi";

export const getNativeTokenSymbol = (chainName: string) => {
  return chains.find((c: { name: string }) => c.name.toLowerCase() === chainName.toLowerCase())?.nativeCurrency.symbol;
};
