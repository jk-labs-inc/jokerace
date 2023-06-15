export type TokenConfig = {
  name: string;
  shorthand: string;
  address: string | null;
};

export type ChainConfig = {
  name: string;
  id: number;
  tokens: TokenConfig[];
};

type ChainConfigs = {
  [key: string]: ChainConfig;
};

const CHAIN_CONFIGS: ChainConfigs = {
  ethereum: {
    name: "Ethereum",
    id: 1,
    tokens: [
      {
        name: "Ethereum",
        shorthand: "eth",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "usdc",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
    ],
  },
  polygon: {
    name: "Polygon",
    id: 137,
    tokens: [
      {
        name: "Matic",
        shorthand: "matic",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "usdc",
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      },
    ],
  },
  arbitrum: {
    name: "Arbitrum",
    id: 42161,
    tokens: [
      {
        name: "Ethereum",
        shorthand: "eth",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "usdc",
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      },
    ],
  },
  optimism: {
    name: "Optimism",
    id: 10,
    tokens: [
      {
        name: "Ethereum",
        shorthand: "eth",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "usdc",
        address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      },
    ],
  },
  mumbai: {
    name: "Mumbai",
    id: 80001,
    tokens: [
      {
        name: "Matic",
        shorthand: "matic",
        address: null,
      },
      {
        name: "USD Coin",
        shorthand: "usdc",
        address: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
      },
    ],
  },
};

export default CHAIN_CONFIGS;
