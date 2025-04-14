const projectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID || "";

export type OnrampParams = {
  address: string;
  chain: string;
  asset: string;
  presetFiatAmount?: number;
  fiatCurrency?: string;
};

export const getOnrampBuyUrl = ({
  address,
  chain,
  asset,
  presetFiatAmount = 20,
  fiatCurrency = "USD",
}: OnrampParams): string => {
  if (!projectId) return "";

  const addresses = encodeURIComponent(
    JSON.stringify({
      [address]: [chain],
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
  "arbitrum",
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
