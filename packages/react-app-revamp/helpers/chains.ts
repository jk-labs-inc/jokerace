export const CHAIN_AVALANCHE_ID = 43_114;
export const avalanche = {
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io/" },
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io/" },
  },
  id: CHAIN_AVALANCHE_ID,
  name: "Avalanche",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  testnet: false,
  iconUrl: "/avalanche.png",
};

export const CHAIN_FANTOM_ID = 250;
export const fantom = {
  blockExplorers: {
    default: { name: "FTMScan", url: "https://ftmscan.com/" },
    etherscan: { name: "FTMScan", url: "https://ftmscan.com/" },
  },
  id: CHAIN_FANTOM_ID,
  name: "Fantom",
  network: "fantom",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    default: "https://rpc.ftm.tools/",
  },
  testnet: false,
  iconUrl: "/fantom.png",
};

export const CHAIN_HARMONY_ID = 1666600000;
export const harmony = {
  blockExplorers: {
    default: { name: "Harmony Blockchain Explorer", url: "https://explorer.harmony.one/" },
    etherscan: { name: "Harmony Blockchain Explorer", url: "https://explorer.harmony.one/" },
  },
  id: CHAIN_HARMONY_ID,
  name: "Harmony Mainnet",
  network: "harmony",
  nativeCurrency: {
    decimals: 18,
    name: "Harmony",
    symbol: "ONE",
  },
  rpcUrls: {
    default: "https://api.harmony.one/",
    default2: "https://s1.api.harmony.one/",
    default3: "https://s2.api.harmony.one/",
    default4: "https://s3.api.harmony.one/",
  },
  testnet: false,
  iconUrl: "/harmony.png",
};

export const CHAIN_GNOSIS_ID = 0x64;
export const gnosis = {
  blockExplorers: {
    default: { name: "Blockscout", url: "https://blockscout.com/xdai/mainnet/" },
    etherscan: { name: "Blockscout", url: "https://blockscout.com/xdai/mainnet/" },
  },
  id: CHAIN_GNOSIS_ID,
  name: "Gnosis chain",
  network: "gnosis",
  nativeCurrency: {
    decimals: 18,
    name: "xDai",
    symbol: "xDAI",
  },
  rpcUrls: {
    default: "https://rpc.gnosischain.com/",
  },
  testnet: false,
  iconUrl: "/gnosis.png",
};
