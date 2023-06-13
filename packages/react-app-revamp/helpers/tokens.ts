type TokenConfig = {
  name: string;
  shorthand: string;
  address: string | null;
};

type ChainConfig = {
  name: string;
  tokens: TokenConfig[];
};

type ChainConfigs = {
  [key: string]: ChainConfig;
};

const CHAIN_CONFIGS: ChainConfigs = {
  ethereum: {
    name: "Ethereum",
    tokens: [
      {
        name: "Ethereum",
        shorthand: "ETH",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
    ],
  },
  polygon: {
    name: "Polygon",
    tokens: [
      {
        name: "Matic",
        shorthand: "MATIC",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "USDC",
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      },
    ],
  },
  arbitrum: {
    name: "Arbitrum",
    tokens: [
      {
        name: "Ethereum",
        shorthand: "ETH",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "USDC",
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      },
    ],
  },
  optimism: {
    name: "Optimism",
    tokens: [
      {
        name: "Ethereum",
        shorthand: "ETH",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "USDC",
        address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      },
    ],
  },
};

export default CHAIN_CONFIGS;
