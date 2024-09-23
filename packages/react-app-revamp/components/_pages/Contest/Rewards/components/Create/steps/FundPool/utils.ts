type ChainNativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

export const generateNativeToken = (nativeCurrency?: ChainNativeCurrency, chainNativeCurrencySymbol?: string) => {
  return {
    address: "native",
    name: nativeCurrency?.name ?? "",
    symbol: chainNativeCurrencySymbol ?? "",
    logoURI: chainNativeCurrencySymbol === "ETH" ? "/tokens/ether.svg" : "/contest/mona-lisa-moustache.png",
    decimals: nativeCurrency?.decimals ?? 18,
  };
};
