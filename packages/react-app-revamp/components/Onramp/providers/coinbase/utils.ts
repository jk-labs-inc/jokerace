const projectId = "";

export type OnrampParams = {
  address: string;
  chain: string;
  asset: string;
  presetFiatAmount?: number;
  fiatCurrency?: string;
};

export const COINBASE_CHAIN_MAPPING: Record<string, string> = {
  arbitrumone: "arbitrum",
};

export const getOnrampBuyUrl = ({
  address,
  chain,
  asset,
  presetFiatAmount = 5,
  fiatCurrency = "USD",
}: OnrampParams): string => {
  if (!projectId) return "";

  const coinbaseChain = COINBASE_CHAIN_MAPPING[chain.toLowerCase()] || chain;

  const addresses = encodeURIComponent(
    JSON.stringify({
      [address]: [coinbaseChain],
    }),
  );

  let url = `https://pay.coinbase.com/buy/select-asset?appId=${projectId}`;

  url += `&addresses=${addresses}`;
  url += `&assets=${encodeURIComponent(JSON.stringify([asset]))}`;
  url += `&defaultPaymentMethod=CARD`;
  url += `&fiatCurrency=${fiatCurrency}`;
  url += `&presetFiatAmount=${presetFiatAmount}`;

  return url;
};

export const COINBASE_SUPPORTED_CHAINS = [
  "arbitrumone",
  "avalanche",
  "base",
  "bnb",
  "gnosis",
  "optimism",
  "polygon",
  "zora",
];

export const isChainSupported = (chain: string): boolean => {
  return COINBASE_SUPPORTED_CHAINS.includes(chain.toLowerCase());
};
